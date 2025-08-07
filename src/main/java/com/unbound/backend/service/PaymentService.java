package com.unbound.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.unbound.backend.dto.PaymentRequest;
import com.unbound.backend.dto.PaymentResponse;
import com.unbound.backend.dto.PaymentVerificationRequest;
import com.unbound.backend.dto.PaymentStatus;
import com.unbound.backend.entity.EventRegistration;
import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.Student;
import com.unbound.backend.entity.College;
import com.unbound.backend.entity.Event;
import com.unbound.backend.repository.EventRegistrationRepository;
import com.unbound.backend.repository.PaymentRepository;
import com.unbound.backend.exception.PaymentFailedException;
import com.unbound.backend.exception.RegistrationNotFoundException;
import com.unbound.backend.exception.CollegeNotFoundException;
import com.unbound.backend.exception.InvalidPaymentRequestException;
import com.unbound.backend.service.EmailService;
import com.unbound.backend.mail.MailTemplateService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private MailTemplateService mailTemplateService;

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    /**
     * Create a payment order for event registration
     */
    public PaymentResponse createOrder(PaymentRequest request) throws RazorpayException {
        logger.info("[PAYMENT] Creating order for registrationId: {}, amount: {}", request.getRegistrationId(), request.getAmount());
        
        // Validate registration exists and belongs to the user
        EventRegistration registration = validateRegistration(request.getRegistrationId());
        
        // Validate payment amount matches event fees
        validatePaymentAmount(registration, request.getAmount());
        
        // Check if payment already exists for this registration
        validateNoExistingPayment(registration);
        
        // Get the college that will receive the payment
        College college = registration.getEvent().getCollege();
        if (college == null) {
            throw new CollegeNotFoundException("College not found for event");
        }
        
        // Create Razorpay order
        Order order = createRazorpayOrder(registration, request);
        
        // Save payment record
        Payment payment = savePaymentRecord(registration, college, order, request);
        
        logger.info("[PAYMENT] Order created successfully for registrationId: {}, orderId: {}", registration.getRid(), order.get("id"));
        
        return buildPaymentResponse(payment, registration);
    }

    /**
     * Update payment status after verification
     */
    public PaymentResponse updatePaymentStatus(PaymentVerificationRequest request) {
        logger.info("[PAYMENT] Updating payment status for orderId: {}, status: {}", request.getRazorpayOrderId(), request.getStatus());
        
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new PaymentFailedException("Payment not found for order ID: " + request.getRazorpayOrderId()));
        
        // Update payment status
        payment.setStatus(request.getStatus());
        payment.setPaymentId(request.getPaymentId());
        payment.setErrorCode(request.getErrorCode());
        payment.setErrorDescription(request.getErrorDescription());
        payment.setSignature(request.getSignature());
        payment.setUpdatedAt(LocalDateTime.now());
        
        paymentRepository.save(payment);
        
        // Update EventRegistration payment status
        EventRegistration registration = payment.getEventRegistration();
        registration.setPaymentStatus(request.getStatus());
        eventRegistrationRepository.save(registration);
        
        // Send notifications if payment is successful
        if (PaymentStatus.PAID.getValue().equalsIgnoreCase(request.getStatus())) {
            mailTemplateService.sendPaymentSuccessNotification(payment, registration);
            mailTemplateService.sendCollegePaymentNotification(payment, registration);
            mailTemplateService.sendRegistrationReceipt(payment.getEventRegistration().getStudent(), 
                                                     payment.getEventRegistration().getEvent(), 
                                                     payment.getEventRegistration(), 
                                                     "RCP" + System.currentTimeMillis(), 
                                                     payment.getEventRegistration().getTeam() != null ? "team" : "solo", 
                                                     payment.getEventRegistration().getTeam(), 
                                                     payment);
        } else if (PaymentStatus.FAILED.getValue().equalsIgnoreCase(request.getStatus())) {
            mailTemplateService.sendPaymentFailureNotification(payment, registration);
        }
        
        logger.info("[PAYMENT] Payment status updated for orderId: {}, status: {}", request.getRazorpayOrderId(), request.getStatus());
        
        return buildPaymentResponse(payment, registration);
    }

    /**
     * Get payment details by order ID
     */
    public PaymentResponse getPaymentByOrderId(String orderId) {
        Payment payment = paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new PaymentFailedException("Payment not found for order ID: " + orderId));
        
        return buildPaymentResponse(payment, payment.getEventRegistration());
    }

    /**
     * Get payment details by payment ID
     */
    public PaymentResponse getPaymentByPaymentId(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new PaymentFailedException("Payment not found for payment ID: " + paymentId));
        
        return buildPaymentResponse(payment, payment.getEventRegistration());
    }

    /**
     * Get all payments for a college
     */
    public List<PaymentResponse> getPaymentsByCollege(College college) {
        List<Payment> payments = paymentRepository.findByCollege(college);
        return payments.stream()
                .map(payment -> buildPaymentResponse(payment, payment.getEventRegistration()))
                .toList();
    }

    /**
     * Get payment analytics for a college
     */
    public Map<String, Object> getPaymentAnalytics(College college) {
        Long totalPaidPayments = paymentRepository.countPaidPaymentsByCollege(college);
        Integer totalAmount = paymentRepository.sumPaidAmountByCollege(college);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalPaidPayments", totalPaidPayments != null ? totalPaidPayments : 0L);
        analytics.put("totalAmount", totalAmount != null ? totalAmount : 0);
        analytics.put("collegeName", college.getCname());
        
        return analytics;
    }

    /**
     * Process refund for a payment
     */
    public PaymentResponse processRefund(Integer paymentId, Integer refundAmount, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentFailedException("Payment not found"));
        
        if (!PaymentStatus.PAID.getValue().equals(payment.getStatus())) {
            throw new InvalidPaymentRequestException("Only paid payments can be refunded");
        }
        
        if (refundAmount > payment.getAmount()) {
            throw new InvalidPaymentRequestException("Refund amount cannot exceed original payment amount");
        }
        
        // Update payment status
        payment.setStatus(refundAmount.equals(payment.getAmount()) ? 
                PaymentStatus.REFUNDED.getValue() : PaymentStatus.PARTIALLY_REFUNDED.getValue());
        payment.setRefundAmount(refundAmount);
        payment.setRefundReason(reason);
        payment.setRefundedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        
        paymentRepository.save(payment);
        
        // Send refund notification
        mailTemplateService.sendRefundNotification(payment);
        
        logger.info("[PAYMENT] Refund processed for paymentId: {}, amount: {}", paymentId, refundAmount);
        
        return buildPaymentResponse(payment, payment.getEventRegistration());
    }

    // Private helper methods

    private EventRegistration validateRegistration(Long registrationId) {
        return eventRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new RegistrationNotFoundException("Registration not found with ID: " + registrationId));
    }

    private void validatePaymentAmount(EventRegistration registration, Integer amount) {
        Integer eventFees = registration.getEvent().getFees();
        if (eventFees == null || !eventFees.equals(amount)) {
            throw new InvalidPaymentRequestException(
                String.format("Payment amount (%d) does not match event fees (%d)", amount, eventFees));
        }
    }

    private void validateNoExistingPayment(EventRegistration registration) {
        List<Payment> existingPayments = paymentRepository.findByEventRegistration(registration);
        boolean hasPaidPayment = existingPayments.stream()
                .anyMatch(p -> PaymentStatus.PAID.getValue().equals(p.getStatus()));
        
        if (hasPaidPayment) {
            throw new InvalidPaymentRequestException("Payment already completed for this registration");
        }
    }

    private Order createRazorpayOrder(EventRegistration registration, PaymentRequest request) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);
        
        College college = registration.getEvent().getCollege();
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount() * 100); // amount in paise
        orderRequest.put("currency", request.getCurrency());
        orderRequest.put("receipt", "reg-" + registration.getRid());
        orderRequest.put("payment_capture", 1);
        
        if (request.getDescription() != null && !request.getDescription().isEmpty()) {
            orderRequest.put("notes", new JSONObject().put("description", request.getDescription()));
        }
        
        // Add college payment routing if configured
        if (college.getRazorpayAccountId() != null && !college.getRazorpayAccountId().isEmpty()) {
            JSONObject transferRequest = new JSONObject();
            transferRequest.put("account", college.getRazorpayAccountId());
            transferRequest.put("amount", request.getAmount() * 100);
            transferRequest.put("currency", request.getCurrency());
            orderRequest.put("transfers", new JSONObject[]{transferRequest});
        }
        
        return client.orders.create(orderRequest);
    }

    private Payment savePaymentRecord(EventRegistration registration, College college, Order order, PaymentRequest request) {
        Payment payment = Payment.builder()
                .eventRegistration(registration)
                .college(college)
                .razorpayOrderId(order.get("id"))
                .status(PaymentStatus.PENDING.getValue())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .receiptEmail(request.getReceiptEmail())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        return paymentRepository.save(payment);
    }

    private PaymentResponse buildPaymentResponse(Payment payment, EventRegistration registration) {
        return PaymentResponse.builder()
                .orderId(payment.getPid().toString())
                .paymentId(payment.getPaymentId())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .receiptEmail(payment.getReceiptEmail())
                .description(payment.getDescription())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .eventName(registration.getEvent().getEname())
                .studentName(registration.getStudent().getSname())
                .collegeName(payment.getCollege().getCname())
                .registrationId(registration.getRid())
                .gatewayOrderId(payment.getRazorpayOrderId())
                .gatewayPaymentId(payment.getPaymentId())
                .gatewayStatus(payment.getStatus())
                .build();
    }


} 