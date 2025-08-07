package com.unbound.backend.repository;

import com.unbound.backend.entity.Team;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByEvent(Event event);
    List<Team> findByCreator(Student creator);
} 