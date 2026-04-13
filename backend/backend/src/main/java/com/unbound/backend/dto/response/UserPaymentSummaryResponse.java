package com.unbound.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPaymentSummaryResponse {
    private Long userId;
    private String userName;
    private String userEmail;
    private int totalTransactions;
    private int successfulTransactions;
    private int failedTransactions;
    private Double totalAmountPaid;
    private List<PaymentHistoryResponse> recentPayments;
}
