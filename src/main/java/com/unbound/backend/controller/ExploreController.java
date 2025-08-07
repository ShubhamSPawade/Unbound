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

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/explore")
@Tag(name = "Public Exploration APIs", description = "APIs for exploring fests and events (public access)")
public class ExploreController {
    @Autowired
    private FestRepository festRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CollegeRepository collegeRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @GetMapping("/fests")
    @Operation(summary = "Explore Fests", description = "Retrieve a list of fests based on various filters.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful retrieval of fests"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - User not authenticated"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> exploreFests(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String mode,
            @AuthenticationPrincipal User user
    ) {
        List<Fest> fests = festRepository.findAll().stream()
                .filter(fest -> fest.isApproved() && fest.isActive())
                .collect(Collectors.toList());
        
        // Apply filters
        if (name != null && !name.trim().isEmpty()) {
            fests = fests.stream()
                    .filter(f -> f.getFname().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (college != null && !college.trim().isEmpty()) {
            fests = fests.stream()
                    .filter(f -> f.getCollege().getCname().toLowerCase().contains(college.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (startDate != null && !startDate.trim().isEmpty()) {
            fests = fests.stream()
                    .filter(f -> f.getStartDate().compareTo(startDate) >= 0)
                    .collect(Collectors.toList());
        }
        if (endDate != null && !endDate.trim().isEmpty()) {
            fests = fests.stream()
                    .filter(f -> f.getEndDate().compareTo(endDate) <= 0)
                    .collect(Collectors.toList());
        }
        if (city != null && !city.trim().isEmpty()) {
            fests = fests.stream()
                    .filter(f -> f.getCity() != null && f.getCity().toLowerCase().contains(city.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (state != null && !state.trim().isEmpty()) {
            fests = fests.stream()
                    .filter(f -> f.getState() != null && f.getState().toLowerCase().contains(state.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (mode != null && !mode.trim().isEmpty()) {
            fests = fests.stream()
                    .filter(f -> f.getMode() != null && f.getMode().toLowerCase().contains(mode.toLowerCase()))
                    .collect(Collectors.toList());
        }
        
        // Sort by start date (upcoming first)
        fests.sort(Comparator.comparing(Fest::getStartDate));
        
        // If user is authenticated, add additional info
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("fests", fests);
            response.put("totalCount", fests.size());
            response.put("userRole", user.getRole().name());
            response.put("isAuthenticated", true);
            return ResponseEntity.ok(response);
        }
        
        // For public users, return basic fest info
        return ResponseEntity.ok(Map.of(
            "fests", fests,
            "totalCount", fests.size(),
            "isAuthenticated", false,
            "message", "Public access - Login for additional features"
        ));
    }

    @GetMapping("/events")
    @Operation(summary = "Explore Events", description = "Retrieve a list of events based on various filters.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful retrieval of events"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - User not authenticated"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> exploreEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String fest,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer minFee,
            @RequestParam(required = false) Integer maxFee,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Boolean teamAllowed,
            @AuthenticationPrincipal User user
    ) {
        List<Event> events = eventRepository.findAll().stream()
                .filter(event -> event.isApproved() && event.isActive())
                .collect(Collectors.toList());
        
        // Apply filters
        if (name != null && !name.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getEname().toLowerCase().contains(name.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (fest != null && !fest.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getFest() != null && e.getFest().getFname().toLowerCase().contains(fest.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (college != null && !college.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getCollege().getCname().toLowerCase().contains(college.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (category != null && !category.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getCategory() != null && e.getCategory().toLowerCase().contains(category.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (mode != null && !mode.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getMode() != null && e.getMode().toLowerCase().contains(mode.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (startDate != null && !startDate.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getEventDate().compareTo(startDate) >= 0)
                    .collect(Collectors.toList());
        }
        if (endDate != null && !endDate.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getEventDate().compareTo(endDate) <= 0)
                    .collect(Collectors.toList());
        }
        if (minFee != null) {
            events = events.stream()
                    .filter(e -> e.getFees() >= minFee)
                    .collect(Collectors.toList());
        }
        if (maxFee != null) {
            events = events.stream()
                    .filter(e -> e.getFees() <= maxFee)
                    .collect(Collectors.toList());
        }
        if (city != null && !city.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getCity() != null && e.getCity().toLowerCase().contains(city.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (state != null && !state.trim().isEmpty()) {
            events = events.stream()
                    .filter(e -> e.getState() != null && e.getState().toLowerCase().contains(state.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (teamAllowed != null) {
            events = events.stream()
                    .filter(e -> e.getTeamIsAllowed().equals(teamAllowed))
                    .collect(Collectors.toList());
        }
        
        // Sort by event date (upcoming first)
        events.sort(Comparator.comparing(Event::getEventDate));
        
        // If user is authenticated, add additional info
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("events", events);
            response.put("totalCount", events.size());
            response.put("userRole", user.getRole().name());
            response.put("isAuthenticated", true);
            
            // Add registration status for students
            if (user.getRole() == User.Role.Student) {
                List<Map<String, Object>> eventsWithStatus = events.stream().map(event -> {
                    Map<String, Object> eventMap = new HashMap<>();
                    eventMap.put("event", event);
                    
                    // Check if student is registered
                    boolean isRegistered = eventRegistrationRepository.findByEvent(event).stream()
                            .anyMatch(reg -> reg.getStudent().getUser().getUid().equals(user.getUid()));
                    eventMap.put("isRegistered", isRegistered);
                    
                    return eventMap;
                }).collect(Collectors.toList());
                response.put("eventsWithStatus", eventsWithStatus);
            }
            
            return ResponseEntity.ok(response);
        }
        
        // For public users, return basic event info
        return ResponseEntity.ok(Map.of(
            "events", events,
            "totalCount", events.size(),
            "isAuthenticated", false,
            "message", "Public access - Login for additional features like registration"
        ));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get Explore Statistics", description = "Retrieve total counts for fests, events, and colleges.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful retrieval of statistics"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<?> getExploreStats() {
        long totalFests = festRepository.findAll().stream()
                .filter(fest -> fest.isApproved() && fest.isActive())
                .count();
        
        long totalEvents = eventRepository.findAll().stream()
                .filter(event -> event.isApproved() && event.isActive())
                .count();
        
        long totalColleges = collegeRepository.count();
        
        return ResponseEntity.ok(Map.of(
            "totalFests", totalFests,
            "totalEvents", totalEvents,
            "totalColleges", totalColleges,
            "message", "Public statistics"
        ));
    }
} 