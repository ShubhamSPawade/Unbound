package com.unbound.backend.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private String orderId;
    private String paymentId;
    private String status;
    private Integer amount;
    private String currency;
    private String receiptEmail;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Event and registration details
    private String eventName;
    private String studentName;
    private String collegeName;
    private Long registrationId;
    
    // Payment gateway details
    private String gatewayOrderId;
    private String gatewayPaymentId;
    private String gatewayStatus;
} 