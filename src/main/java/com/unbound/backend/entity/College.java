package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "college")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class College {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cid;

    @OneToOne
    @JoinColumn(name = "uid", referencedColumnName = "uid", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String cname;

    @Column(columnDefinition = "TEXT")
    private String cdescription;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String contactEmail; // Contact email for the college

    @Column(length = 100)
    private String razorpayAccountId; // Razorpay account ID for receiving payments

    @Column(length = 100)
    private String bankAccountNumber; // Bank account for receiving payments

    @Column(length = 100)
    private String bankIfscCode; // Bank IFSC code

    @Column(length = 100)
    private String bankAccountHolderName; // Bank account holder name
} 