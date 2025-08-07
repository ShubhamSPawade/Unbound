package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "event_review")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "eid", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "sid", nullable = false)
    private Student student;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(length = 1000)
    private String reviewText;

    @Column(nullable = false)
    private String createdAt;
} 