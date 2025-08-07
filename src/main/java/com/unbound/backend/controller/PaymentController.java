package com.unbound.backend.controller;

import com.razorpay.RazorpayException;
import com.unbound.backend.dto.PaymentRequest;
import com.unbound.backend.dto.PaymentResponse;
import com.unbound.backend.dto.PaymentVerificationRequest;
import com.unbound.backend.entity.EventRegistration;
import com.unbound.backend.entity.User;
import com.unbound.backend.entity.College;
import com.unbound.backend.repository.EventRegistrationRepository;
import com.unbound.backend.repository.CollegeRepository;
import com.unbound.backend.service.PaymentService;
import com.unbound.backend.exception.PaymentFailedException;
import com.unbound.backend.exception.RegistrationNotFoundException;
import com.unbound.backend.exception.InvalidPaymentRequestException;
import com.unbound.backend.exception.ForbiddenActionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.stream.Collectors;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment Management APIs", description = "APIs for payment processing and management")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    
    @Autowired
    private CollegeRepository collegeRepository;

    @GetMapping("/registrations")
    @Operation(summary = "Get all registrations", description = "Retrieves all event registrations with payment status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registrations retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only authenticated users can view registrations")
    })
    public ResponseEntity<?> getAllRegistrations() {
        List<EventRegistration> allRegistrations = eventRegistrationRepository.findAll();
        List<Map<String, Object>> registrations = allRegistrations.stream()
            .map(reg -> {
                Map<String, Object> regInfo = new HashMap<>();
                regInfo.put("registrationId", reg.getRid());
                regInfo.put("eventId", reg.getEvent().getEid());
                regInfo.put("eventName", reg.getEvent().getEname());
                regInfo.put("studentId", reg.getStudent().getSid());
                regInfo.put("studentName", reg.getStudent().getSname());
                regInfo.put("studentEmail", reg.getStudent().getUser().getEmail());
                regInfo.put("registrationDate", reg.getErdateTime());
                regInfo.put("registrationStatus", reg.getStatus());
                regInfo.put("paymentStatus", reg.getPaymentStatus());
                regInfo.put("fees", reg.getEvent().getFees());
                if (reg.getTeam() != null) {
                    regInfo.put("teamName", reg.getTeam().getTname());
                    regInfo.put("teamId", reg.getTeam().getTid());
                } else {
                    regInfo.put("teamName", null);
                    regInfo.put("teamId", null);
                }
                return regInfo;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of(
            "totalRegistrations", allRegistrations.size(),
            "registrations", registrations
        ));
    }

    @PostMapping("/create-order")
    @Operation(summary = "Create payment order", description = "Creates a payment order for event registration")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment order created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid payment request"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only students can create payment orders"),
        @ApiResponse(responseCode = "404", description = "Registration not found"),
        @ApiResponse(responseCode = "409", description = "Payment already exists for this registration")
    })
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal User user, 
                                       @Valid @RequestBody PaymentRequest request) {
        try {
            // Validate user is a student
            if (user == null || user.getRole() != User.Role.Student) {
                throw new ForbiddenActionException("Only students can create payment orders");
            }
            
            PaymentResponse response = paymentService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            throw new PaymentFailedException("Payment gateway error: " + e.getMessage());
        } catch (RegistrationNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Registration not found", "message", e.getMessage()));
        } catch (InvalidPaymentRequestException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid payment request", "message", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify payment", description = "Verifies and updates payment status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment verified successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid verification request"),
        @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody PaymentVerificationRequest request) {
        try {
            PaymentResponse response = paymentService.updatePaymentStatus(request);
            return ResponseEntity.ok(response);
        } catch (PaymentFailedException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Payment not found", "message", e.getMessage()));
        }
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get payment by order ID", description = "Retrieves payment details by Razorpay order ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment details retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    public ResponseEntity<?> getPaymentByOrderId(@PathVariable String orderId) {
        try {
            PaymentResponse response = paymentService.getPaymentByOrderId(orderId);
            return ResponseEntity.ok(response);
        } catch (PaymentFailedException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Payment not found", "message", e.getMessage()));
        }
    }

    @GetMapping("/payment/{paymentId}")
    @Operation(summary = "Get payment by payment ID", description = "Retrieves payment details by Razorpay payment ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment details retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    public ResponseEntity<?> getPaymentByPaymentId(@PathVariable String paymentId) {
        try {
            PaymentResponse response = paymentService.getPaymentByPaymentId(paymentId);
            return ResponseEntity.ok(response);
        } catch (PaymentFailedException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Payment not found", "message", e.getMessage()));
        }
    }

    @GetMapping("/college/payments")
    @Operation(summary = "Get college payments", description = "Retrieves all payments for the authenticated college")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payments retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can view their payments"),
        @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getCollegePayments(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            throw new ForbiddenActionException("Only colleges can view their payments");
        }
        
        College college = collegeRepository.findByUserUid(user.getUid())
                .orElseThrow(() -> new RegistrationNotFoundException("College not found"));
        
        List<PaymentResponse> payments = paymentService.getPaymentsByCollege(college);
        return ResponseEntity.ok(Map.of("payments", payments, "totalPayments", payments.size()));
    }

    @GetMapping("/college/analytics")
    @Operation(summary = "Get college payment analytics", description = "Retrieves payment analytics for the authenticated college")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Analytics retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can view analytics"),
        @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getCollegeAnalytics(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            throw new ForbiddenActionException("Only colleges can view analytics");
        }
        
        College college = collegeRepository.findByUserUid(user.getUid())
                .orElseThrow(() -> new RegistrationNotFoundException("College not found"));
        
        Map<String, Object> analytics = paymentService.getPaymentAnalytics(college);
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/refund/{paymentId}")
    @Operation(summary = "Process refund", description = "Processes a refund for a payment")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Refund processed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid refund request"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can process refunds"),
        @ApiResponse(responseCode = "404", description = "Payment not found")
    })
    public ResponseEntity<?> processRefund(@AuthenticationPrincipal User user,
                                         @PathVariable Integer paymentId,
                                         @RequestBody Map<String, Object> request) {
        if (user == null || user.getRole() != User.Role.College) {
            throw new ForbiddenActionException("Only colleges can process refunds");
        }
        
        Integer refundAmount = (Integer) request.get("refundAmount");
        String reason = (String) request.get("reason");
        
        if (refundAmount == null || refundAmount <= 0) {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid refund amount"));
        }
        
        try {
            PaymentResponse response = paymentService.processRefund(paymentId, refundAmount, reason);
            return ResponseEntity.ok(response);
        } catch (PaymentFailedException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Payment not found", "message", e.getMessage()));
        } catch (InvalidPaymentRequestException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid refund request", "message", e.getMessage()));
        }
    }
} 