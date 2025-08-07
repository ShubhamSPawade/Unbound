package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "fest")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fid;

    @ManyToOne
    @JoinColumn(name = "cid", referencedColumnName = "cid", nullable = false)
    private College college;

    @Column(nullable = false)
    private String fname;

    @Column(columnDefinition = "TEXT")
    private String fdescription;

    @Column(nullable = false)
    private String startDate;

    @Column(nullable = false)
    private String endDate;

    @Column(nullable = false)
    private boolean approved = false;

    @Column(nullable = false)
    private boolean active = true;

    @Column(length = 255)
    private String festImageUrl; // URL or path to fest banner/image

    @Column(length = 255)
    private String festThumbnailUrl; // URL or path to fest thumbnail

    @Column(length = 100)
    private String city; // City where fest is held

    @Column(length = 100)
    private String state; // State where fest is held

    @Column(length = 100)
    private String country; // Country where fest is held

    @Column(length = 20)
    private String mode; // Online, Offline, Hybrid

    @Column(length = 100)
    private String website; // Fest website URL

    @Column(length = 15)
    private String contactPhone; // Contact phone number
} 