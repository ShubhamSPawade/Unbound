package com.unbound.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatisticsResponse {
    private int totalPayments;
    private int successfulPayments;
    private int failedPayments;
    private int pendingPayments;
    private int refundedPayments;
    private Double totalRevenue;
    private Double averageTransactionAmount;
}
