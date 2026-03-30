package com.unbound.backend.controller;

import com.unbound.backend.dto.request.ClubRequest;
import com.unbound.backend.dto.request.ClubStatusRequest;
import com.unbound.backend.dto.response.ApiResponse;
import com.unbound.backend.dto.response.ClubResponse;
import com.unbound.backend.service.ClubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
@Tag(name = "Clubs", description = "Club management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ClubController {

    private final ClubService clubService;

    // CLUB_ADMIN only
    @PostMapping
    @Operation(summary = "Create a new club (CLUB_ADMIN only)")
    @PreAuthorize("hasRole('CLUB_ADMIN')")
    public ResponseEntity<ApiResponse<ClubResponse>> createClub(@Valid @RequestBody ClubRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Club registration submitted for approval", clubService.createClub(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update club (CLUB_ADMIN own club, or Admin)")
    @PreAuthorize("hasAnyRole('CLUB_ADMIN', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ClubResponse>> updateClub(
            @PathVariable Long id, @Valid @RequestBody ClubRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Club updated successfully", clubService.updateClub(id, request)));
    }

    // Any authenticated user
    @GetMapping
    @Operation(summary = "Get all approved clubs")
    public ResponseEntity<ApiResponse<List<ClubResponse>>> getAllApprovedClubs() {
        return ResponseEntity.ok(ApiResponse.success("Clubs fetched", clubService.getAllApprovedClubs()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get club by ID")
    public ResponseEntity<ApiResponse<ClubResponse>> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Club fetched", clubService.getClubById(id)));
    }

    // Admin only
    @GetMapping("/admin/all")
    @Operation(summary = "Get all clubs including PENDING (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ClubResponse>>> getAllClubsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("All clubs fetched", clubService.getAllClubsForAdmin()));
    }

    @PatchMapping("/{id}/approve")
    @Operation(summary = "Approve a club (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<ClubResponse>> approveClub(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Club approved successfully", clubService.approveClub(id)));
    }

    @PatchMapping("/{id}/reject")
    @Operation(summary = "Reject a club with reason (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<ClubResponse>> rejectClub(
            @PathVariable Long id, @Valid @RequestBody ClubStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Club rejected", clubService.rejectClub(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a club (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.ok(ApiResponse.success("Club deactivated successfully", null));
    }
}
