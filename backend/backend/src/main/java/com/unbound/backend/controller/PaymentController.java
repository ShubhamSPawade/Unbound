package com.unbound.backend.controller;

import com.unbound.backend.dto.request.PaymentVerifyRequest;
import com.unbound.backend.dto.response.ApiResponse;
import com.unbound.backend.dto.response.PaymentResponse;
import com.unbound.backend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay payment integration — Step 1: create-order → Step 2: verify (success) or failure")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order/{eventId}")
    @Operation(
        summary = "Step 1 — Create Razorpay order",
        description = "Creates a Razorpay order for a paid event. Returns razorpayOrderId and amount. Pass these to the Razorpay frontend checkout."
    )
    public ResponseEntity<ApiResponse<PaymentResponse>> createOrder(@PathVariable Long eventId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", paymentService.createOrder(eventId)));
    }

    @PostMapping("/verify")
    @Operation(
        summary = "Step 2a — Verify payment (success callback)",
        description = "Called after successful Razorpay payment. Verifies HMAC SHA256 signature. On success: payment marked SUCCESS and registration CONFIRMED."
    )
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", paymentService.verifyPayment(request)));
    }

    @PostMapping("/failure")
    @Operation(
        summary = "Step 2b — Handle payment failure",
        description = "Called when Razorpay payment fails or is dismissed. Marks payment as FAILED. Registration remains PENDING."
    )
    public ResponseEntity<ApiResponse<PaymentResponse>> handleFailure(
            @RequestParam String razorpayOrderId,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(ApiResponse.success("Payment failure recorded", paymentService.handleFailure(razorpayOrderId, reason)));
    }

    @GetMapping("/my")
    @Operation(
        summary = "Get my payment history",
        description = "Returns all payments made by the currently authenticated user."
    )
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments() {
        return ResponseEntity.ok(ApiResponse.success("Payments fetched", paymentService.getMyPayments()));
    }

    @GetMapping("/event/{eventId}")
    @Operation(
        summary = "Get all payments for an event (Admin only)",
        description = "Returns all payment records for a specific event. Accessible by CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN."
    )
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success("Payments fetched", paymentService.getPaymentsByEvent(eventId)));
    }
}
