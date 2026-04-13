package com.unbound.backend.dto.response;

import com.unbound.backend.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistoryResponse {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String eventVenue;
    private LocalDateTime eventDate;
    private Double amount;
    private PaymentStatus status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String failureReason;
    private LocalDateTime paymentDate;
    private LocalDateTime updatedAt;
}
