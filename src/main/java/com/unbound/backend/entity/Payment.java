package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pid;

    @ManyToOne
    @JoinColumn(name = "rid", referencedColumnName = "rid", nullable = false)
    private EventRegistration eventRegistration;

    @ManyToOne
    @JoinColumn(name = "cid", referencedColumnName = "cid", nullable = false)
    private College college; // College that receives the payment

    @Column(nullable = false)
    private String razorpayOrderId;

    @Column(nullable = false)
    private String status; // pending, paid, failed, cancelled, refunded, partially_refunded

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private String paymentId; // Razorpay payment id (after success)

    @Column
    private String receiptEmail;
    
    @Column
    private String description; // Optional payment description
    
    @Column
    private String errorCode; // For failed payments
    
    @Column
    private String errorDescription; // For failed payments
    
    @Column
    private String signature; // For payment verification
    
    @Column
    private LocalDateTime refundedAt; // When payment was refunded
    
    @Column
    private Integer refundAmount; // Amount refunded
    
    @Column
    private String refundReason; // Reason for refund
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 