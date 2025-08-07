package com.unbound.backend.repository;

import com.unbound.backend.entity.UnregisteredTeamMember;
import com.unbound.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnregisteredTeamMemberRepository extends JpaRepository<UnregisteredTeamMember, Long> {
    List<UnregisteredTeamMember> findByTeam(Team team);
    List<UnregisteredTeamMember> findByTeamAndEmail(Team team, String email);
} 