package com.unbound.backend.repository;

import com.unbound.backend.entity.EventRegistration;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Student;
import com.unbound.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByStudent(Student student);
    List<EventRegistration> findByEvent(Event event);
    Optional<EventRegistration> findByEventAndStudent(Event event, Student student);
    List<EventRegistration> findByTeam(Team team);
} 