package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "event")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eid;

    @ManyToOne
    @JoinColumn(name = "cid", referencedColumnName = "cid", nullable = false)
    private College college;

    @ManyToOne
    @JoinColumn(name = "fid", referencedColumnName = "fid")
    private Fest fest;

    @Column(nullable = false)
    private String ename;

    @Column(columnDefinition = "TEXT")
    private String edescription;

    @Column(nullable = false)
    private String eventDate;

    @Column(nullable = false)
    private Integer fees = 0;

    private String location;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Boolean teamIsAllowed = false;

    @Column(nullable = false)
    private Integer minTeamSize = 1; // Minimum team size when team registration is allowed

    @Column(nullable = false)
    private Integer maxTeamSize = 1; // Maximum team size when team registration is allowed

    @Column(length = 100)
    private String category; // e.g., Technical, Cultural, Sports, etc.

    @Column(length = 20)
    private String mode; // Online, Offline

    @Column(length = 255)
    private String posterUrl; // URL or path to event poster/banner

    @Column(length = 255)
    private String posterThumbnailUrl; // URL or path to event poster thumbnail

    @Column(nullable = false)
    private boolean approved = false;

    @Column(nullable = false)
    private boolean active = true;

    @Column(length = 100)
    private String cashPrize; // Cash prize amount and description

    @Column(length = 100)
    private String firstPrize; // First prize details

    @Column(length = 100)
    private String secondPrize; // Second prize details

    @Column(length = 100)
    private String thirdPrize; // Third prize details

    @Column(length = 100)
    private String city; // City where event is held

    @Column(length = 100)
    private String state; // State where event is held

    @Column(length = 100)
    private String country; // Country where event is held

    @Column(length = 100)
    private String eventWebsite; // Event specific website URL

    @Column(length = 15)
    private String contactPhone; // Contact phone number

    @Column(length = 100)
    private String organizerName; // Name of event organizer

    @Column(length = 100)
    private String organizerEmail; // Email of event organizer

    @Column(length = 100)
    private String organizerPhone; // Phone of event organizer

    @Column(length = 500)
    private String rules; // Event rules and guidelines

    @Column(length = 500)
    private String requirements; // Event requirements and prerequisites

    @Column(nullable = false)
    private String registrationDeadline; // Last date for registration

    @Column(nullable = false)
    private boolean registrationOpen = true; // Whether registration is open
} 