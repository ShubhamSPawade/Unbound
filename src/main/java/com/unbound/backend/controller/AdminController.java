package com.unbound.backend.controller;

import com.unbound.backend.entity.*;
import com.unbound.backend.repository.*;
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

import java.util.*;
import java.util.stream.Collectors;
import com.unbound.backend.exception.ForbiddenActionException;
import com.unbound.backend.exception.FestNotFoundException;
import com.unbound.backend.exception.EventNotFoundException;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management APIs", description = "APIs for admin operations (Admin access required)")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {
    @Autowired
    private FestRepository festRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CollegeRepository collegeRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/fests/pending")
    @Operation(summary = "Get pending fests for approval", description = "Retrieves a list of fests that are pending approval.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved pending fests"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "No pending fests found")
    })
    public ResponseEntity<?> getPendingFests(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can access this endpoint");
        }
        List<Fest> pendingFests = festRepository.findAll().stream()
                .filter(fest -> !fest.isApproved() && fest.isActive())
                .collect(Collectors.toList());
        return ResponseEntity.ok(pendingFests);
    }

    @GetMapping("/events/pending")
    @Operation(summary = "Get pending events for approval", description = "Retrieves a list of events that are pending approval.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved pending events"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "No pending events found")
    })
    public ResponseEntity<?> getPendingEvents(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can access this endpoint");
        }
        List<Event> pendingEvents = eventRepository.findAll().stream()
                .filter(event -> !event.isApproved() && event.isActive())
                .collect(Collectors.toList());
        return ResponseEntity.ok(pendingEvents);
    }

    @PostMapping("/fests/{festId}/approve")
    @Operation(summary = "Approve a fest", description = "Approves a fest by ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Fest approved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can approve fests"),
        @ApiResponse(responseCode = "404", description = "Fest not found")
    })
    public ResponseEntity<?> approveFest(@AuthenticationPrincipal User user, @PathVariable Long festId) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can approve fests");
        }
        Fest fest = festRepository.findById(festId).orElse(null);
        if (fest == null) {
            throw new FestNotFoundException("Fest not found");
        }
        fest.setApproved(true);
        festRepository.save(fest);
        return ResponseEntity.ok(Map.of("message", "Fest approved successfully"));
    }

    @PostMapping("/fests/{festId}/reject")
    @Operation(summary = "Reject a fest", description = "Rejects a fest by ID and provides a reason.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Fest rejected successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can reject fests"),
        @ApiResponse(responseCode = "404", description = "Fest not found")
    })
    public ResponseEntity<?> rejectFest(@AuthenticationPrincipal User user, @PathVariable Long festId, @RequestBody Map<String, String> request) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can reject fests");
        }
        Fest fest = festRepository.findById(festId).orElse(null);
        if (fest == null) {
            throw new FestNotFoundException("Fest not found");
        }
        String reason = request.getOrDefault("reason", "No reason provided");
        fest.setActive(false);
        festRepository.save(fest);
        return ResponseEntity.ok(Map.of("message", "Fest rejected successfully", "reason", reason));
    }

    @PostMapping("/events/{eventId}/approve")
    @Operation(summary = "Approve an event", description = "Approves an event by ID.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event approved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can approve events"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<?> approveEvent(@AuthenticationPrincipal User user, @PathVariable Long eventId) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can approve events");
        }
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            throw new EventNotFoundException("Event not found");
        }
        event.setApproved(true);
        eventRepository.save(event);
        return ResponseEntity.ok(Map.of("message", "Event approved successfully"));
    }

    @PostMapping("/events/{eventId}/reject")
    @Operation(summary = "Reject an event", description = "Rejects an event by ID and provides a reason.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event rejected successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can reject events"),
        @ApiResponse(responseCode = "404", description = "Event not found")
    })
    public ResponseEntity<?> rejectEvent(@AuthenticationPrincipal User user, @PathVariable Long eventId, @RequestBody Map<String, String> request) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can reject events");
        }
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            throw new EventNotFoundException("Event not found");
        }
        String reason = request.getOrDefault("reason", "No reason provided");
        event.setActive(false);
        eventRepository.save(event);
        return ResponseEntity.ok(Map.of("message", "Event rejected successfully", "reason", reason));
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get admin dashboard statistics", description = "Retrieves various statistics for the admin dashboard.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved admin dashboard statistics"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can access this endpoint")
    })
    public ResponseEntity<?> getAdminDashboardStats(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can access this endpoint");
        }
        
        long totalColleges = collegeRepository.count();
        long totalFests = festRepository.count();
        long totalEvents = eventRepository.count();
        long totalRegistrations = eventRegistrationRepository.count();
        long totalPayments = paymentRepository.count();
        
        long pendingFests = festRepository.findAll().stream()
                .filter(fest -> !fest.isApproved() && fest.isActive())
                .count();
        
        long pendingEvents = eventRepository.findAll().stream()
                .filter(event -> !event.isApproved() && event.isActive())
                .count();
        
        return ResponseEntity.ok(Map.of(
            "totalColleges", totalColleges,
            "totalFests", totalFests,
            "totalEvents", totalEvents,
            "totalRegistrations", totalRegistrations,
            "totalPayments", totalPayments,
            "pendingFests", pendingFests,
            "pendingEvents", pendingEvents
        ));
    }

    @GetMapping("/colleges")
    @Operation(summary = "Get all colleges", description = "Retrieves a list of all colleges.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved all colleges"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only admins can access this endpoint")
    })
    public ResponseEntity<?> getAllColleges(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Admin) {
            throw new ForbiddenActionException("Only admins can access this endpoint");
        }
        List<College> colleges = collegeRepository.findAll();
        return ResponseEntity.ok(colleges);
    }
} 