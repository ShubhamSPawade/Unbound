package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "event_registration")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rid;

    @ManyToOne
    @JoinColumn(name = "eid", referencedColumnName = "eid", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "sid", referencedColumnName = "sid", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "tid", referencedColumnName = "tid")
    private Team team;

    @Column(nullable = false)
    private String erdateTime;

    @Column(nullable = false)
    private String status = "registered";

    @Column(nullable = false)
    private String paymentStatus = "pending"; // pending, paid, failed

    @Column(nullable = false)
    private boolean certificateApproved = false;
} 