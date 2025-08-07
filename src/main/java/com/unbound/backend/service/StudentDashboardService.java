package com.unbound.backend.service;

import com.unbound.backend.entity.*;
import com.unbound.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StudentDashboardService {
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    @Autowired
    private EventReviewRepository eventReviewRepository;

    private static final Logger logger = LoggerFactory.getLogger(StudentDashboardService.class);

    public List<Map<String, Object>> getMyRegistrations(Student student) {
        logger.info("[STUDENT DASHBOARD] Fetching registrations for student: {}", student.getSname());
        List<EventRegistration> regs = eventRegistrationRepository.findByStudent(student);
        List<Map<String, Object>> result = new ArrayList<>();
        for (EventRegistration reg : regs) {
            Event event = reg.getEvent();
            Map<String, Object> eventInfo = new HashMap<>();
            eventInfo.put("registrationId", reg.getRid());
            eventInfo.put("eventId", event.getEid());
            eventInfo.put("eventName", event.getEname());
            eventInfo.put("festName", event.getFest() != null ? event.getFest().getFname() : null);
            eventInfo.put("eventDate", event.getEventDate());
            eventInfo.put("location", event.getLocation());
            eventInfo.put("registrationStatus", reg.getStatus());
            eventInfo.put("paymentStatus", reg.getPaymentStatus());
            eventInfo.put("teamId", reg.getTeam() != null ? reg.getTeam().getTid() : null);
            eventInfo.put("teamName", reg.getTeam() != null ? reg.getTeam().getTname() : null);
            eventInfo.put("ticketUrl", null);
            var reviewOpt = eventReviewRepository.findByEventAndStudent(event, student);
            if (reviewOpt.isPresent()) {
                eventInfo.put("reviewed", true);
                eventInfo.put("review", Map.of(
                    "rating", reviewOpt.get().getRating(),
                    "reviewText", reviewOpt.get().getReviewText(),
                    "createdAt", reviewOpt.get().getCreatedAt()
                ));
            } else {
                eventInfo.put("reviewed", false);
                boolean canReview = false;
                try {
                    canReview = java.time.LocalDate.now().isAfter(java.time.LocalDate.parse(event.getEventDate()));
                } catch (Exception e) { throw new RuntimeException("Invalid event date format"); }
                eventInfo.put("canReview", canReview);
            }
            result.add(eventInfo);
        }
        logger.info("[STUDENT DASHBOARD] Found {} registrations for student: {}", result.size(), student.getSname());
        return result;
    }

    public Map<String, Object> getStudentDashboardStats(Student student) {
        logger.info("[STUDENT DASHBOARD] Fetching dashboard stats for student: {}", student.getSname());
        List<EventRegistration> regs = eventRegistrationRepository.findByStudent(student);
        int totalEvents = regs.size();
        long totalPaid = regs.stream().filter(r -> "paid".equalsIgnoreCase(r.getPaymentStatus())).count();
        long reviewsGiven = regs.stream().filter(r -> eventReviewRepository.findByEventAndStudent(r.getEvent(), student).isPresent()).count();
        long upcoming = regs.stream().filter(r -> {
            try {
                return java.time.LocalDate.parse(r.getEvent().getEventDate()).isAfter(java.time.LocalDate.now());
            } catch (Exception e) { throw new RuntimeException("Invalid event date format"); }
        }).count();
        long past = regs.stream().filter(r -> {
            try {
                return java.time.LocalDate.parse(r.getEvent().getEventDate()).isBefore(java.time.LocalDate.now());
            } catch (Exception e) { throw new RuntimeException("Invalid event date format"); }
        }).count();
        Map<String, Object> stats = Map.of(
            "totalEvents", totalEvents,
            "totalPaid", totalPaid,
            "reviewsGiven", reviewsGiven,
            "upcomingEvents", upcoming,
            "pastEvents", past
        );
        logger.info("[STUDENT DASHBOARD] Dashboard stats fetched for student: {}", student.getSname());
        return stats;
    }
} 