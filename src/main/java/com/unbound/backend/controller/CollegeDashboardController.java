package com.unbound.backend.controller;

import com.unbound.backend.entity.*;
import com.unbound.backend.repository.*;
import com.unbound.backend.service.CollegeDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/college/dashboard")
@Tag(name = "College Dashboard APIs", description = "APIs for college dashboard and analytics (College access required)")
@SecurityRequirement(name = "bearerAuth")
public class CollegeDashboardController {
    private static final Logger logger = LoggerFactory.getLogger(CollegeDashboardController.class);
    @Autowired
    private CollegeRepository collegeRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    @Autowired
    private FestRepository festRepository;
    @Autowired
    private EventReviewRepository eventReviewRepository;
    @Autowired
    private CollegeDashboardService collegeDashboardService;

    private College getCollegeForUser(User user) {
        if (user == null || user.getUid() == null) {
            return null;
        }
        return collegeRepository.findByUserUid(user.getUid()).orElse(null);
    }

    @GetMapping("/earnings")
    @Operation(summary = "Get total earnings for a college", description = "Retrieves the total earnings for a college based on paid registrations.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Total earnings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can access this endpoint"),
            @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getTotalEarnings(@AuthenticationPrincipal User user) {
        logger.info("[GET] /api/college/dashboard/earnings called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        List<Event> events = eventRepository.findByCollege(college);
        List<Payment> payments = events.stream()
                .flatMap(e -> paymentRepository.findAll().stream()
                        .filter(p -> p.getEventRegistration().getEvent().getEid().equals(e.getEid()) && "paid".equalsIgnoreCase(p.getStatus())))
                .collect(Collectors.toList());
        int totalEarnings = payments.stream().mapToInt(Payment::getAmount).sum();
        Map<String, Object> breakdown = new HashMap<>();
        for (Event event : events) {
            int eventEarnings = payments.stream()
                    .filter(p -> p.getEventRegistration().getEvent().getEid().equals(event.getEid()))
                    .mapToInt(Payment::getAmount).sum();
            breakdown.put(event.getEname(), eventEarnings);
        }
        logger.info("Total earnings calculated for college: {} (uid={})", college != null ? college.getCname() : "null", user != null ? user.getUid() : null);
        return ResponseEntity.ok(Map.of(
                "totalEarnings", totalEarnings,
                "breakdown", breakdown
        ));
    }

    @GetMapping("/registrations")
    @Operation(summary = "Get registration statistics for a college", description = "Retrieves total, paid, and unpaid registrations for a college.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registration statistics retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can access this endpoint"),
            @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getRegistrationStats(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        List<Event> events = eventRepository.findByCollege(college);
        List<EventRegistration> allRegs = events.stream()
                .flatMap(e -> eventRegistrationRepository.findByEvent(e).stream())
                .collect(Collectors.toList());
        int totalRegistrations = allRegs.size();
        long paidRegistrations = allRegs.stream().filter(r -> "paid".equalsIgnoreCase(r.getPaymentStatus())).count();
        long unpaidRegistrations = allRegs.stream().filter(r -> !"paid".equalsIgnoreCase(r.getPaymentStatus())).count();
        Map<String, Object> eventWise = new HashMap<>();
        for (Event event : events) {
            long eventTotal = allRegs.stream().filter(r -> r.getEvent().getEid().equals(event.getEid())).count();
            long eventPaid = allRegs.stream().filter(r -> r.getEvent().getEid().equals(event.getEid()) && "paid".equalsIgnoreCase(r.getPaymentStatus())).count();
            long eventUnpaid = allRegs.stream().filter(r -> r.getEvent().getEid().equals(event.getEid()) && !"paid".equalsIgnoreCase(r.getPaymentStatus())).count();
            eventWise.put(event.getEname(), Map.of(
                "total", eventTotal,
                "paid", eventPaid,
                "unpaid", eventUnpaid
            ));
        }
        return ResponseEntity.ok(Map.of(
            "totalRegistrations", totalRegistrations,
            "paidRegistrations", paidRegistrations,
            "unpaidRegistrations", unpaidRegistrations,
            "eventWise", eventWise
        ));
    }

    @GetMapping("/analytics/by-fest")
    @Operation(summary = "Get analytics by fest for a college", description = "Retrieves registration and earnings statistics for each fest.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Analytics by fest retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can access this endpoint"),
            @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getStatsByFest(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        List<Fest> fests = festRepository.findByCollege(college);
        Map<String, Object> festStats = new HashMap<>();
        for (Fest fest : fests) {
            List<Event> festEvents = eventRepository.findByFest(fest);
            int festRegistrations = 0;
            int festEarnings = 0;
            for (Event event : festEvents) {
                List<EventRegistration> regs = eventRegistrationRepository.findByEvent(event);
                festRegistrations += regs.size();
                festEarnings += paymentRepository.findAll().stream()
                        .filter(p -> p.getEventRegistration().getEvent().getEid().equals(event.getEid()) && "paid".equalsIgnoreCase(p.getStatus()))
                        .mapToInt(Payment::getAmount).sum();
            }
            festStats.put(fest.getFname(), Map.of(
                "registrations", festRegistrations,
                "earnings", festEarnings
            ));
        }
        return ResponseEntity.ok(festStats);
    }

    @GetMapping("/analytics/by-date")
    @Operation(summary = "Get analytics by date for a college", description = "Retrieves registration and earnings statistics for each event by date.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Analytics by date retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can access this endpoint"),
            @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getStatsByDate(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        List<Event> events = eventRepository.findByCollege(college);
        Map<String, Map<String, Object>> dateStats = new HashMap<>();
        for (Event event : events) {
            String date = event.getEventDate();
            dateStats.putIfAbsent(date, new HashMap<>());
            Map<String, Object> stats = dateStats.get(date);
            int regCount = eventRegistrationRepository.findByEvent(event).size();
            int earnings = paymentRepository.findAll().stream()
                    .filter(p -> p.getEventRegistration().getEvent().getEid().equals(event.getEid()) && "paid".equalsIgnoreCase(p.getStatus()))
                    .mapToInt(Payment::getAmount).sum();
            stats.put("registrations", ((int) stats.getOrDefault("registrations", 0)) + regCount);
            stats.put("earnings", ((int) stats.getOrDefault("earnings", 0)) + earnings);
        }
        return ResponseEntity.ok(dateStats);
    }

    @GetMapping("/analytics/top-events")
    @Operation(summary = "Get top events by registrations and earnings for a college", description = "Retrieves the top 5 events by registrations and earnings.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top events retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can access this endpoint"),
            @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getTopEvents(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        List<Event> events = eventRepository.findByCollege(college);
        List<Map<String, Object>> eventStats = new ArrayList<>();
        for (Event event : events) {
            int regCount = eventRegistrationRepository.findByEvent(event).size();
            int earnings = paymentRepository.findAll().stream()
                    .filter(p -> p.getEventRegistration().getEvent().getEid().equals(event.getEid()) && "paid".equalsIgnoreCase(p.getStatus()))
                    .mapToInt(Payment::getAmount).sum();
            eventStats.add(Map.of(
                "eventName", event.getEname(),
                "registrations", regCount,
                "earnings", earnings
            ));
        }
        // Top 5 by registrations
        List<Map<String, Object>> topByRegistrations = eventStats.stream()
                .sorted((a, b) -> Integer.compare((int) b.get("registrations"), (int) a.get("registrations")))
                .limit(5)
                .collect(Collectors.toList());
        // Top 5 by earnings
        List<Map<String, Object>> topByEarnings = eventStats.stream()
                .sorted((a, b) -> Integer.compare((int) b.get("earnings"), (int) a.get("earnings")))
                .limit(5)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Map.of(
            "topByRegistrations", topByRegistrations,
            "topByEarnings", topByEarnings
        ));
    }

    @GetMapping("/college/dashboard/events/{eventId}/registrations")
    @Operation(summary = "Get registrations for a specific event", description = "Retrieves all registrations for a specific event.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Registrations retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can view event registrations"),
            @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> getEventRegistrations(@AuthenticationPrincipal User user, @PathVariable("eventId") Long eventId) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can view event registrations"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        
        List<EventRegistration> registrations = eventRegistrationRepository.findByEvent(event);
        List<Map<String, Object>> registrationDetails = registrations.stream().map(reg -> {
            Map<String, Object> details = new HashMap<>();
            details.put("registrationId", reg.getRid());
            details.put("studentId", reg.getStudent().getSid());
            details.put("studentName", reg.getStudent().getSname());
            details.put("studentEmail", reg.getStudent().getUser().getEmail());
            details.put("registrationDate", reg.getErdateTime());
            details.put("registrationStatus", reg.getStatus());
            details.put("paymentStatus", reg.getPaymentStatus());
            details.put("certificateApproved", reg.isCertificateApproved());
            
            if (reg.getTeam() != null) {
                details.put("teamName", reg.getTeam().getTname());
                details.put("teamId", reg.getTeam().getTid());
                details.put("isTeamCreator", reg.getTeam().getCreator().getSid().equals(reg.getStudent().getSid()));
            } else {
                details.put("teamName", null);
                details.put("teamId", null);
                details.put("isTeamCreator", false);
            }
            
            return details;
        }).collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("eventId", eventId);
        response.put("eventName", event.getEname());
        response.put("totalRegistrations", registrations.size());
        response.put("eventCapacity", event.getCapacity());
        response.put("availableSlots", event.getCapacity() - registrations.size());
        response.put("registrations", registrationDetails);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/college/dashboard/events/{eventId}/registrations/{registrationId}/approve-certificate")
    @Operation(summary = "Approve a certificate for a specific registration", description = "Approves a certificate for a specific registration.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Certificate approved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can approve certificates"),
            @ApiResponse(responseCode = "404", description = "Registration not found for this event or not owned by this college")
    })
    public ResponseEntity<?> approveCertificate(@AuthenticationPrincipal User user, @PathVariable("eventId") Long eventId, @PathVariable("registrationId") Long registrationId) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can approve certificates"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        Optional<EventRegistration> regOpt = eventRegistrationRepository.findById(registrationId);
        if (regOpt.isEmpty() || !regOpt.get().getEvent().getEid().equals(eventId)) {
            return ResponseEntity.status(404).body(Map.of("error", "Registration not found for this event"));
        }
        EventRegistration reg = regOpt.get();
        reg.setCertificateApproved(true);
        eventRegistrationRepository.save(reg);
        return ResponseEntity.ok(Map.of("message", "Certificate approved for registrationId " + registrationId));
    }

    @PostMapping("/college/dashboard/events/{eventId}/registrations/approve-all-certificates")
    @Operation(summary = "Approve certificates for all registrations in an event", description = "Approves certificates for all registrations in a specific event.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Certificates approved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can approve certificates"),
            @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> approveAllCertificates(@AuthenticationPrincipal User user, @PathVariable("eventId") Long eventId) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can approve certificates"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        List<EventRegistration> regs = eventRegistrationRepository.findByEvent(event);
        for (EventRegistration reg : regs) {
            reg.setCertificateApproved(true);
        }
        eventRegistrationRepository.saveAll(regs);
        return ResponseEntity.ok(Map.of("message", "Certificates approved for all registrations in eventId " + eventId));
    }

    @PostMapping("/college/dashboard/events/{eventId}/registrations/approve-certificates")
    @Operation(summary = "Approve certificates for a list of registrations", description = "Approves certificates for a list of specific registrations in an event.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Certificates approved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can approve certificates"),
            @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> approveCertificatesForList(@AuthenticationPrincipal User user, @PathVariable("eventId") Long eventId, @RequestBody Map<String, List<Long>> req) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can approve certificates"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        List<Long> registrationIds = req.getOrDefault("registrationIds", List.of());
        int approved = 0;
        for (Long regId : registrationIds) {
            Optional<EventRegistration> regOpt = eventRegistrationRepository.findById(regId);
            if (regOpt.isPresent() && regOpt.get().getEvent().getEid().equals(eventId)) {
                EventRegistration reg = regOpt.get();
                reg.setCertificateApproved(true);
                eventRegistrationRepository.save(reg);
                approved++;
            }
        }
        return ResponseEntity.ok(Map.of("message", "Certificates approved for " + approved + " registrations in eventId " + eventId));
    }

    @GetMapping("/events")
    @Operation(summary = "Get all events for a college", description = "Retrieves all events associated with a college.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Events retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can access this endpoint"),
            @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getAllCollegeEvents(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        return ResponseEntity.ok(collegeDashboardService.getAllCollegeEvents(college));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard statistics for a college", description = "Retrieves various statistics for a college dashboard.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard statistics retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Only colleges can access this endpoint"),
            @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getCollegeDashboardStats(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) return ResponseEntity.status(404).body(Map.of("error", "College not found"));
        return ResponseEntity.ok(collegeDashboardService.getCollegeDashboardStats(college));
    }
} 