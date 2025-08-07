package com.unbound.backend.controller;

import com.unbound.backend.entity.*;
import com.unbound.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import com.unbound.backend.exception.StudentNotFoundException;
import com.unbound.backend.exception.EventNotFoundException;
import com.unbound.backend.exception.ForbiddenActionException;
import com.unbound.backend.exception.RegistrationClosedException;

@RestController
@RequestMapping("/api/events")
public class EventReviewController {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    @Autowired
    private EventReviewRepository eventReviewRepository;
    @Autowired
    private CollegeRepository collegeRepository;

    private Student getStudentForUser(User user) {
        return studentRepository.findAll().stream()
                .filter(s -> s.getUser().getUid().equals(user.getUid()))
                .findFirst().orElse(null);
    }

    // Student submits a review (only after event is completed and registered)
    @PostMapping("/{eventId}/review")
    public ResponseEntity<?> submitReview(@AuthenticationPrincipal User user, @PathVariable Long eventId, @RequestBody Map<String, Object> req) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new ForbiddenActionException("Only students can submit reviews");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new StudentNotFoundException("Student not found");
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) throw new EventNotFoundException("Event not found");
        // Check event is completed
        LocalDate today = LocalDate.now();
        LocalDate eventDate = LocalDate.parse(event.getEventDate());
        if (today.isBefore(eventDate)) {
            throw new RegistrationClosedException("You can only review after the event is completed");
        }
        // Check registration
        Optional<EventRegistration> regOpt = eventRegistrationRepository.findByEventAndStudent(event, student);
        if (regOpt.isEmpty() || (!"paid".equalsIgnoreCase(regOpt.get().getPaymentStatus()) && event.getFees() > 0)) {
            throw new RegistrationClosedException("You must be a registered and paid participant to review");
        }
        // One review per student per event
        if (eventReviewRepository.findByEventAndStudent(event, student).isPresent()) {
            throw new RegistrationClosedException("You have already reviewed this event");
        }
        Integer rating = (Integer) req.get("rating");
        String reviewText = (String) req.getOrDefault("reviewText", "");
        if (rating == null || rating < 1 || rating > 5) {
            throw new RegistrationClosedException("Rating must be between 1 and 5");
        }
        EventReview review = EventReview.builder()
                .event(event)
                .student(student)
                .rating(rating)
                .reviewText(reviewText)
                .createdAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME))
                .build();
        eventReviewRepository.save(review);
        return ResponseEntity.ok(Map.of("message", "Review submitted"));
    }

    // Student views their review for an event
    @GetMapping("/{eventId}/review")
    public ResponseEntity<?> getMyReview(@AuthenticationPrincipal User user, @PathVariable Long eventId) {
        if (user == null || user.getRole() != User.Role.Student) {
            return ResponseEntity.status(403).body(Map.of("error", "Only students can view their review"));
        }
        Student student = getStudentForUser(user);
        if (student == null) return ResponseEntity.status(404).body(Map.of("error", "Student not found"));
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return ResponseEntity.status(404).body(Map.of("error", "Event not found"));
        Optional<EventReview> reviewOpt = eventReviewRepository.findByEventAndStudent(event, student);
        if (reviewOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "No review found"));
        return ResponseEntity.ok(reviewOpt.get());
    }

    // College views all reviews for an event
    @GetMapping("/{eventId}/reviews")
    public ResponseEntity<?> getEventReviews(@AuthenticationPrincipal User user, @PathVariable Long eventId) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can view reviews"));
        }
        College college = collegeRepository.findAll().stream()
                .filter(c -> c.getUser().getUid().equals(user.getUid()))
                .findFirst().orElse(null);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        List<EventReview> reviews = eventReviewRepository.findByEvent(event);
        return ResponseEntity.ok(reviews);
    }

    // Get average rating and review count for an event
    @GetMapping("/{eventId}/rating")
    public ResponseEntity<?> getEventRating(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return ResponseEntity.status(404).body(Map.of("error", "Event not found"));
        List<EventReview> reviews = eventReviewRepository.findByEvent(event);
        double avg = reviews.stream().mapToInt(EventReview::getRating).average().orElse(0.0);
        int count = reviews.size();
        return ResponseEntity.ok(Map.of(
            "eventId", eventId,
            "averageRating", avg,
            "reviewCount", count
        ));
    }
} 