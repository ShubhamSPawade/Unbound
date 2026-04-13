package com.unbound.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.unbound.backend.dto.request.PaymentVerifyRequest;
import com.unbound.backend.dto.response.PaymentHistoryResponse;
import com.unbound.backend.dto.response.PaymentResponse;
import com.unbound.backend.dto.response.PaymentStatisticsResponse;
import com.unbound.backend.dto.response.UserPaymentSummaryResponse;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.Registration;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.PaymentStatus;
import com.unbound.backend.enums.RegistrationStatus;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.exception.ResourceNotFoundException;
import com.unbound.backend.repository.EventRepository;
import com.unbound.backend.repository.PaymentRepository;
import com.unbound.backend.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private static final int PAISE_MULTIPLIER = 100; // 1 INR = 100 paise

    private final PaymentRepository paymentRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserService userService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .eventId(payment.getEvent().getId())
                .eventTitle(payment.getEvent().getTitle())
                .userId(payment.getUser().getId())
                .userName(payment.getUser().getName())
                .amount(payment.getAmount())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .status(payment.getStatus())
                .failureReason(payment.getFailureReason())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    private PaymentHistoryResponse toHistoryResponse(Payment payment) {
        return PaymentHistoryResponse.builder()
                .id(payment.getId())
                .eventId(payment.getEvent().getId())
                .eventTitle(payment.getEvent().getTitle())
                .eventVenue(payment.getEvent().getVenue())
                .eventDate(payment.getEvent().getEventDate())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .failureReason(payment.getFailureReason())
                .paymentDate(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    // POST /api/payments/create-order/{eventId}
    @Transactional
    public PaymentResponse createOrder(Long eventId) {
        User currentUser = userService.getCurrentUser();

        log.info("User {} creating payment order for event {}", currentUser.getId(), eventId);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getFeeAmount() == null || event.getFeeAmount() <= 0) {
            log.warn("Payment attempt for free event {}", eventId);
            throw new BadRequestException("This event is free. No payment required.");
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(event.getFeeAmount() * PAISE_MULTIPLIER));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_event_" + eventId + "_user_" + currentUser.getId());

            Order razorpayOrder = client.orders.create(orderRequest);

            Payment payment = Payment.builder()
                    .user(currentUser)
                    .event(event)
                    .amount(event.getFeeAmount())
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .status(PaymentStatus.PENDING)
                    .build();

            Payment savedPayment = paymentRepository.save(payment);
            log.info("Payment order created successfully. Order ID: {}", savedPayment.getRazorpayOrderId());

            return toResponse(savedPayment);

        } catch (RazorpayException e) {
            log.error("Failed to create Razorpay order for event {}", eventId, e);
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    // POST /api/payments/verify
    @Transactional
    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        log.info("Verifying payment for order: {}", request.getRazorpayOrderId());

        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + request.getRazorpayOrderId()));

        boolean isValid = verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValid) {
            log.warn("Payment verification failed for order: {}", request.getRazorpayOrderId());
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Invalid payment signature");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed. Invalid signature.");
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        log.info("Payment verified successfully. Payment ID: {}", request.getRazorpayPaymentId());

        registrationRepository.findByUserAndEvent(payment.getUser(), payment.getEvent())
                .ifPresent(reg -> {
                    reg.setStatus(RegistrationStatus.CONFIRMED);
                    registrationRepository.save(reg);
                    log.info("Registration confirmed for user {} and event {}", 
                            payment.getUser().getId(), payment.getEvent().getId());
                });

        return toResponse(payment);
    }

    // POST /api/payments/failure
    @Transactional
    public PaymentResponse handleFailure(String razorpayOrderId, String reason) {
        log.warn("Payment failure for order: {}. Reason: {}", razorpayOrderId, reason);

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(reason != null ? reason : "Payment failed");
        paymentRepository.save(payment);

        return toResponse(payment);
    }

    // GET /api/payments/my — student's transaction history
    @Transactional(readOnly = true)
    public List<PaymentResponse> getMyPayments() {
        User currentUser = userService.getCurrentUser();
        return paymentRepository.findAllByUserOrderByCreatedAtDesc(currentUser)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/payments/history/my — detailed payment history
    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getMyPaymentHistory() {
        User currentUser = userService.getCurrentUser();
        log.info("Fetching payment history for user {}", currentUser.getId());
        return paymentRepository.findAllByUserOrderByCreatedAtDesc(currentUser)
                .stream().map(this::toHistoryResponse).collect(Collectors.toList());
    }

    // GET /api/payments/history/my/status/{status} — filter by status
    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getMyPaymentsByStatus(PaymentStatus status) {
        User currentUser = userService.getCurrentUser();
        log.info("Fetching {} payments for user {}", status, currentUser.getId());
        return paymentRepository.findAllByUserAndStatusOrderByCreatedAtDesc(currentUser, status)
                .stream().map(this::toHistoryResponse).collect(Collectors.toList());
    }

    // GET /api/payments/history/my/date-range — filter by date range
    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> getMyPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        User currentUser = userService.getCurrentUser();
        log.info("Fetching payments for user {} between {} and {}", 
                currentUser.getId(), startDate, endDate);
        return paymentRepository.findByUserAndDateRange(currentUser, startDate, endDate)
                .stream().map(this::toHistoryResponse).collect(Collectors.toList());
    }

    // GET /api/payments/history/my/summary — user payment summary
    @Transactional(readOnly = true)
    public UserPaymentSummaryResponse getMyPaymentSummary() {
        User currentUser = userService.getCurrentUser();
        
        List<Payment> allPayments = paymentRepository.findAllByUserOrderByCreatedAtDesc(currentUser);
        List<Payment> recentPayments = allPayments.stream().limit(5).collect(Collectors.toList());
        
        int successful = (int) allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS).count();
        int failed = (int) allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.FAILED).count();
        
        Double totalPaid = paymentRepository.getTotalAmountByUser(currentUser);
        
        log.info("Payment summary for user {}: Total={}, Success={}, Failed={}, Amount={}", 
                currentUser.getId(), allPayments.size(), successful, failed, totalPaid);

        return UserPaymentSummaryResponse.builder()
                .userId(currentUser.getId())
                .userName(currentUser.getName())
                .userEmail(currentUser.getEmail())
                .totalTransactions(allPayments.size())
                .successfulTransactions(successful)
                .failedTransactions(failed)
                .totalAmountPaid(totalPaid != null ? totalPaid : 0.0)
                .recentPayments(recentPayments.stream()
                        .map(this::toHistoryResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    // GET /api/payments/event/{eventId} — admin views payments for an event
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return paymentRepository.findAllByEventOrderByCreatedAtDesc(event)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/payments/admin/statistics — overall payment statistics
    @Transactional(readOnly = true)
    public PaymentStatisticsResponse getPaymentStatistics() {
        List<Payment> allPayments = paymentRepository.findAll();
        
        int total = allPayments.size();
        int successful = paymentRepository.countByStatus(PaymentStatus.SUCCESS);
        int failed = paymentRepository.countByStatus(PaymentStatus.FAILED);
        int pending = paymentRepository.countByStatus(PaymentStatus.PENDING);
        int refunded = paymentRepository.countByStatus(PaymentStatus.REFUNDED);
        
        Double totalRevenue = allPayments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Payment::getAmount)
                .sum();
        
        Double avgAmount = successful > 0 ? totalRevenue / successful : 0.0;
        
        log.info("Payment statistics - Total: {}, Success: {}, Failed: {}, Revenue: {}", 
                total, successful, failed, totalRevenue);

        return PaymentStatisticsResponse.builder()
                .totalPayments(total)
                .successfulPayments(successful)
                .failedPayments(failed)
                .pendingPayments(pending)
                .refundedPayments(refunded)
                .totalRevenue(totalRevenue)
                .averageTransactionAmount(avgAmount)
                .build();
    }

    // GET /api/payments/admin/filter — advanced filtering
    @Transactional(readOnly = true)
    public List<PaymentHistoryResponse> filterPayments(
            Long userId, Long eventId, PaymentStatus status, 
            LocalDateTime startDate, LocalDateTime endDate) {
        
        log.info("Filtering payments - User: {}, Event: {}, Status: {}", userId, eventId, status);
        
        return paymentRepository.filterPayments(userId, eventId, status, startDate, endDate)
                .stream().map(this::toHistoryResponse).collect(Collectors.toList());
    }

    // HMAC SHA256 signature verification
    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String generated = HexFormat.of().formatHex(hash);
            return generated.equals(signature);
        } catch (Exception e) {
            log.error("Signature verification error", e);
            return false;
        }
    }
}
