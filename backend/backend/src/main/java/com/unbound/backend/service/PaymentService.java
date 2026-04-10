package com.unbound.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.unbound.backend.dto.request.PaymentVerifyRequest;
import com.unbound.backend.dto.response.PaymentResponse;
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
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

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

    // POST /api/payments/create-order/{eventId}
    // Creates a Razorpay order and saves a PENDING payment record
    public PaymentResponse createOrder(Long eventId) {
        User currentUser = userService.getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getFeeAmount() == null || event.getFeeAmount() <= 0) {
            throw new BadRequestException("This event is free. No payment required.");
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            // Razorpay amount is in paise (1 INR = 100 paise)
            orderRequest.put("amount", (int)(event.getFeeAmount() * 100));
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

            return toResponse(paymentRepository.save(payment));

        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    // POST /api/payments/verify — #36 payment success callback
    // Verifies Razorpay signature and confirms payment + registration
    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + request.getRazorpayOrderId()));

        // Verify HMAC SHA256 signature
        boolean isValid = verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!isValid) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Invalid payment signature");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment verification failed. Invalid signature.");
        }

        // Update payment record
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        // Confirm the registration
        registrationRepository.findByUserAndEvent(payment.getUser(), payment.getEvent())
                .ifPresent(reg -> {
                    reg.setStatus(RegistrationStatus.CONFIRMED);
                    registrationRepository.save(reg);
                });

        return toResponse(payment);
    }

    // POST /api/payments/failure — #36 payment failure callback
    public PaymentResponse handleFailure(String razorpayOrderId, String reason) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + razorpayOrderId));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(reason != null ? reason : "Payment failed");
        paymentRepository.save(payment);

        return toResponse(payment);
    }

    // GET /api/payments/my — student's transaction history
    public List<PaymentResponse> getMyPayments() {
        User currentUser = userService.getCurrentUser();
        return paymentRepository.findAllByUser(currentUser)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/payments/event/{eventId} — admin views payments for an event
    public List<PaymentResponse> getPaymentsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return paymentRepository.findAllByEvent(event)
                .stream().map(this::toResponse).collect(Collectors.toList());
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
            return false;
        }
    }
}
