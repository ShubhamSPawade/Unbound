package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "unregistered_team_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnregisteredTeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tid", referencedColumnName = "tid", nullable = false)
    private Team team;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String college;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String addedBy; // Email of the team leader who added this member
} 