package com.unbound.backend.controller;

import com.unbound.backend.dto.request.EventRequest;
import com.unbound.backend.dto.response.ApiResponse;
import com.unbound.backend.dto.response.EventResponse;
import com.unbound.backend.service.EventService;
import com.unbound.backend.enums.EventCategory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Event management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class EventController {

    private final EventService eventService;

    // CLUB_ADMIN, COLLEGE_ADMIN, SUPER_ADMIN
    @PostMapping
    @Operation(summary = "Create a new event")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", eventService.createEvent(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an event")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Event updated", eventService.updateEvent(id, request)));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publish an event")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> publishEvent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Event published", eventService.publishEvent(id)));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel an event")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> cancelEvent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Event cancelled", eventService.cancelEvent(id)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted", null));
    }

    // Any authenticated user
    @GetMapping
    @Operation(summary = "Get all published events with optional filters")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllPublishedEvents(
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) Long clubId,
            @RequestParam(required = false) Long festId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(ApiResponse.success("Events fetched",
                eventService.getAllPublishedEvents(category, clubId, festId, from, to)));
    }

    @GetMapping("/admin/all")
    @Operation(summary = "Get all events (Admin only)")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN', 'CLUB_ADMIN')")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEventsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("All events fetched", eventService.getAllEventsForAdmin()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Event fetched", eventService.getEventById(id)));
    }

    @GetMapping("/fest/{festId}")
    @Operation(summary = "Get published events by fest")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsByFest(@PathVariable Long festId) {
        return ResponseEntity.ok(ApiResponse.success("Events fetched", eventService.getEventsByFest(festId)));
    }

    @GetMapping("/club/{clubId}")
    @Operation(summary = "Get events by club")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsByClub(@PathVariable Long clubId) {
        return ResponseEntity.ok(ApiResponse.success("Events fetched", eventService.getEventsByClub(clubId)));
    }
}
