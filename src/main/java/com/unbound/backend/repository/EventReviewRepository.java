package com.unbound.backend.repository;

import com.unbound.backend.entity.EventReview;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EventReviewRepository extends JpaRepository<EventReview, Integer> {
    List<EventReview> findByEvent(Event event);
    Optional<EventReview> findByEventAndStudent(Event event, Student student);
} 