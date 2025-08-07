package com.unbound.backend.repository;

import com.unbound.backend.entity.TeamMembers;
import com.unbound.backend.entity.Team;
import com.unbound.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TeamMembersRepository extends JpaRepository<TeamMembers, TeamMembers.TeamMemberId> {
    List<TeamMembers> findByTeam(Team team);
    List<TeamMembers> findByStudent(Student student);
    Optional<TeamMembers> findByTeamAndStudent(Team team, Student student);
} 