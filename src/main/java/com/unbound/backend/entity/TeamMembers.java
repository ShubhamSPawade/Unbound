package com.unbound.backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "team_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(TeamMembers.TeamMemberId.class)
public class TeamMembers {
    @Id
    @ManyToOne
    @JoinColumn(name = "tid", referencedColumnName = "tid", nullable = false)
    private Team team;

    @Id
    @ManyToOne
    @JoinColumn(name = "sid", referencedColumnName = "sid", nullable = false)
    private Student student;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeamMemberId implements Serializable {
        private Long team;
        private Long student;
    }
} 