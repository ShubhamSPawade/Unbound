package com.unbound.backend.controller;

import com.unbound.backend.entity.*;
import com.unbound.backend.repository.*;
import com.unbound.backend.exception.EventNotFoundException;
import com.unbound.backend.exception.TeamNotFoundException;
import com.unbound.backend.exception.StudentNotFoundException;
import com.unbound.backend.exception.ForbiddenActionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student/teams")
public class TeamController {
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private TeamMembersRepository teamMembersRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private EventRepository eventRepository;

    private Student getStudentForUser(User user) {
        return studentRepository.findAll().stream()
                .filter(s -> s.getUser().getUid().equals(user.getUid()))
                .findFirst().orElse(null);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> viewTeamsForEvent(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) throw new EventNotFoundException("Event not found");
        List<Team> teams = teamRepository.findByEvent(event);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/my")
    public ResponseEntity<?> myTeams(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new ForbiddenActionException("Only students can view their teams");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new StudentNotFoundException("Student not found");
        List<TeamMembers> memberships = teamMembersRepository.findByStudent(student);
        List<Team> teams = memberships.stream().map(TeamMembers::getTeam).collect(Collectors.toList());
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<?> getTeam(@PathVariable("teamId") Long teamId) {
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) throw new TeamNotFoundException("Team not found");
        List<TeamMembers> members = teamMembersRepository.findByTeam(team);
        List<Student> students = members.stream().map(TeamMembers::getStudent).collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @DeleteMapping("/{teamId}/leave")
    public ResponseEntity<?> leaveTeam(@AuthenticationPrincipal User user, @PathVariable Long teamId) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new ForbiddenActionException("Only students can leave teams");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new StudentNotFoundException("Student not found");
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) throw new TeamNotFoundException("Team not found");
        TeamMembers.TeamMemberId id = new TeamMembers.TeamMemberId(team.getTid(), student.getSid());
        if (!teamMembersRepository.existsById(id)) {
            throw new ForbiddenActionException("You are not a member of this team");
        }
        teamMembersRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Left the team successfully"));
    }
} 