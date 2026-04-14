package com.unbound.backend.controller;

import com.unbound.backend.dto.request.PaymentVerifyRequest;
import com.unbound.backend.dto.response.ApiResponse;
import com.unbound.backend.dto.response.PaymentHistoryResponse;
import com.unbound.backend.dto.response.PaymentResponse;
import com.unbound.backend.dto.response.PaymentStatisticsResponse;
import com.unbound.backend.dto.response.UserPaymentSummaryResponse;
import com.unbound.backend.enums.PaymentStatus;
import com.unbound.backend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay payment integration and payment history management")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;

    // ─── Payment Processing ──────────────────────────────────────────────────────

    @PostMapping("/create-order/{eventId}")
    @Operation(
        summary = "Step 1 — Create Razorpay order",
        description = "Creates a Razorpay order for a paid event. Returns razorpayOrderId and amount."
    )
    public ResponseEntity<ApiResponse<PaymentResponse>> createOrder(@PathVariable Long eventId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", paymentService.createOrder(eventId)));
    }

    @PostMapping("/verify")
    @Operation(
        summary = "Step 2a — Verify payment (success callback)",
        description = "Called after successful Razorpay payment. Verifies HMAC SHA256 signature."
    )
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(
            @Valid @RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", 
                paymentService.verifyPayment(request)));
    }

    @PostMapping("/failure")
    @Operation(
        summary = "Step 2b — Handle payment failure",
        description = "Called when Razorpay payment fails or is dismissed. Marks payment as FAILED."
    )
    public ResponseEntity<ApiResponse<PaymentResponse>> handleFailure(
            @RequestParam String razorpayOrderId,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(ApiResponse.success("Payment failure recorded", 
                paymentService.handleFailure(razorpayOrderId, reason)));
    }

    // ─── Payment History (Student) ───────────────────────────────────────────────

    @GetMapping("/my")
    @Operation(summary = "Get my payment history", description = "Returns all payments made by current user")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments() {
        return ResponseEntity.ok(ApiResponse.success("Payments fetched", paymentService.getMyPayments()));
    }

    @GetMapping("/history/my")
    @Operation(summary = "Get detailed payment history", description = "Returns detailed payment history with event info")
    public ResponseEntity<ApiResponse<List<PaymentHistoryResponse>>> getMyPaymentHistory() {
        return ResponseEntity.ok(ApiResponse.success("Payment history fetched", 
                paymentService.getMyPaymentHistory()));
    }

    @GetMapping("/history/my/status/{status}")
    @Operation(summary = "Filter my payments by status", description = "Returns payments filtered by status")
    public ResponseEntity<ApiResponse<List<PaymentHistoryResponse>>> getMyPaymentsByStatus(
            @PathVariable PaymentStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Filtered payments fetched", 
                paymentService.getMyPaymentsByStatus(status)));
    }

    @GetMapping("/history/my/date-range")
    @Operation(summary = "Filter my payments by date range", description = "Returns payments within date range")
    public ResponseEntity<ApiResponse<List<PaymentHistoryResponse>>> getMyPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success("Payments fetched for date range", 
                paymentService.getMyPaymentsByDateRange(startDate, endDate)));
    }

    @GetMapping("/history/my/summary")
    @Operation(summary = "Get payment summary", description = "Returns payment summary with statistics")
    public ResponseEntity<ApiResponse<UserPaymentSummaryResponse>> getMyPaymentSummary() {
        return ResponseEntity.ok(ApiResponse.success("Payment summary fetched", 
                paymentService.getMyPaymentSummary()));
    }

    // ─── Admin Endpoints ─────────────────────────────────────────────────────────

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get all payments for an event (Admin)", description = "Returns all payment records for event")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success("Payments fetched", 
                paymentService.getPaymentsByEvent(eventId)));
    }

    @GetMapping("/admin/statistics")
    @Operation(summary = "Get payment statistics (Admin)", description = "Returns overall payment statistics")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<PaymentStatisticsResponse>> getPaymentStatistics() {
        return ResponseEntity.ok(ApiResponse.success("Statistics fetched", 
                paymentService.getPaymentStatistics()));
    }

    @GetMapping("/admin/filter")
    @Operation(summary = "Advanced payment filtering (Admin)", description = "Filter payments by multiple criteria")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<PaymentHistoryResponse>>> filterPayments(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success("Filtered payments fetched", 
                paymentService.filterPayments(userId, eventId, status, startDate, endDate)));
    }
}
