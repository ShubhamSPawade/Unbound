package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class PaymentVerificationRequest {
    @NotBlank(message = "Razorpay order ID is required")
    private String razorpayOrderId;
    
    @NotBlank(message = "Payment status is required")
    private String status;
    
    private String paymentId; // Optional, only for successful payments
    
    private String signature; // For signature verification
    
    private String errorCode; // For failed payments
    private String errorDescription; // For failed payments
} 