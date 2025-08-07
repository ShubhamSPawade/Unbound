package com.unbound.backend.controller;

import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Fest;
import com.unbound.backend.repository.EventRepository;
import com.unbound.backend.repository.FestRepository;
import com.unbound.backend.repository.EventRegistrationRepository;
import com.unbound.backend.exception.EventNotFoundException;
import com.unbound.backend.exception.ForbiddenActionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Event Statistics APIs", description = "Public APIs for event statistics")
public class EventStatsController {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private FestRepository festRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;

    @GetMapping("/{eventId}/stats")
    @Operation(summary = "Get event statistics", description = "Retrieves statistics for a specific event. This is a public endpoint that does not require authentication.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event statistics retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "400", description = "Invalid event date format")
    })
    public ResponseEntity<?> getEventStats(@PathVariable("eventId") Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) throw new EventNotFoundException("Event not found");
        int registrationCount = eventRegistrationRepository.findByEvent(event).size();
        String eventDate = event.getEventDate();
        LocalDate today = LocalDate.now();
        LocalDate eventDay;
        try {
            eventDay = LocalDate.parse(eventDate);
        } catch (Exception e) {
            throw new ForbiddenActionException("Invalid event date format");
        }
        // Registration deadline: use fest endDate if linked, else event date
        String deadline = eventDay.toString();
        if (event.getFest() != null) {
            Fest fest = event.getFest();
            deadline = fest.getEndDate();
        }
        long daysLeft = ChronoUnit.DAYS.between(today, eventDay);
        
        // Calculate capacity and available seats
        int capacity = event.getCapacity();
        int availableSeats = Math.max(0, capacity - registrationCount);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("registrationCount", registrationCount);
        stats.put("capacity", capacity);
        stats.put("availableSeats", availableSeats);
        stats.put("daysLeft", daysLeft);
        stats.put("registrationDeadline", deadline);
        stats.put("eventDate", eventDate);
        return ResponseEntity.ok(stats);
    }
} 