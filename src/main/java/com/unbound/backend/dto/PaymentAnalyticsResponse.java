package com.unbound.backend.dto;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PaymentAnalyticsResponse {
    private String collegeName;
    private Long totalPayments;
    private Long paidPayments;
    private Long failedPayments;
    private Long pendingPayments;
    private Long refundedPayments;
    private Integer totalAmount;
    private Integer paidAmount;
    private Integer refundedAmount;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
    private List<PaymentTrend> paymentTrends;
    
    @Data
    @Builder
    public static class PaymentTrend {
        private String date;
        private Long count;
        private Integer amount;
        private String status;
    }
} 