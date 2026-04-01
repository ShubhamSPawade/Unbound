package com.unbound.backend.controller;

import com.unbound.backend.dto.response.ApiResponse;
import com.unbound.backend.dto.response.RegistrationResponse;
import com.unbound.backend.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@Tag(name = "Registrations", description = "Event registration endpoints")
@SecurityRequirement(name = "bearerAuth")
public class RegistrationController {

    private final RegistrationService registrationService;

    // Any authenticated user — register for event
    @PostMapping("/{eventId}")
    @Operation(summary = "Register for an event")
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(@PathVariable Long eventId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registered successfully", registrationService.registerForEvent(eventId)));
    }

    // Any authenticated user — cancel own registration
    @DeleteMapping("/{eventId}")
    @Operation(summary = "Cancel registration for an event")
    public ResponseEntity<ApiResponse<Void>> cancel(@PathVariable Long eventId) {
        registrationService.cancelRegistration(eventId);
        return ResponseEntity.ok(ApiResponse.success("Registration cancelled", null));
    }

    // Any authenticated user — view own registrations (My Events)
    @GetMapping("/my")
    @Operation(summary = "Get my registrations")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getMyRegistrations() {
        return ResponseEntity.ok(ApiResponse.success("Registrations fetched", registrationService.getMyRegistrations()));
    }

    // Admin only — view all registrations for an event
    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get all registrations for an event (Admin only)")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success("Registrations fetched", registrationService.getRegistrationsByEvent(eventId)));
    }

    // Any authenticated user — registration count for capacity bar
    @GetMapping("/event/{eventId}/count")
    @Operation(summary = "Get registration count for an event")
    public ResponseEntity<ApiResponse<Integer>> getRegistrationCount(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success("Count fetched", registrationService.getRegistrationCount(eventId)));
    }
}
