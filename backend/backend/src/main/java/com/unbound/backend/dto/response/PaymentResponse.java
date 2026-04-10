package com.unbound.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.unbound.backend.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponse {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long userId;
    private String userName;
    private Double amount;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private PaymentStatus status;
    private String failureReason;
    private LocalDateTime createdAt;
}
