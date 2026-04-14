package com.unbound.backend.controller;

import com.unbound.backend.dto.request.BulkClubActionRequest;
import com.unbound.backend.dto.request.ClubRequest;
import com.unbound.backend.dto.request.ClubStatusRequest;
import com.unbound.backend.dto.response.ApiResponse;
import com.unbound.backend.dto.response.BulkActionResponse;
import com.unbound.backend.dto.response.ClubResponse;
import com.unbound.backend.dto.response.ClubStatisticsResponse;
import com.unbound.backend.enums.ClubStatus;
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

    @GetMapping("/my")
    @Operation(summary = "Get current CLUB_ADMIN's own club")
    @PreAuthorize("hasRole('CLUB_ADMIN')")
    public ResponseEntity<ApiResponse<ClubResponse>> getMyClub() {
        return ResponseEntity.ok(ApiResponse.success("Club fetched", clubService.getMyClub()));
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

    @GetMapping("/admin/status/{status}")
    @Operation(summary = "Get clubs by status (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ClubResponse>>> getClubsByStatus(@PathVariable ClubStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Clubs fetched by status", clubService.getClubsByStatus(status)));
    }

    @GetMapping("/admin/filter")
    @Operation(summary = "Filter clubs by status and college (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ClubResponse>>> filterClubs(
            @RequestParam(required = false) ClubStatus status,
            @RequestParam(required = false) Long collegeId) {
        return ResponseEntity.ok(ApiResponse.success("Filtered clubs fetched", 
                clubService.filterClubs(status, collegeId)));
    }

    @GetMapping("/admin/statistics")
    @Operation(summary = "Get club statistics (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<ClubStatisticsResponse>> getClubStatistics() {
        return ResponseEntity.ok(ApiResponse.success("Statistics fetched", clubService.getClubStatistics()));
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

    @PostMapping("/admin/bulk-action")
    @Operation(summary = "Bulk approve or reject clubs (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<BulkActionResponse>> bulkApproveOrReject(
            @Valid @RequestBody BulkClubActionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Bulk action completed", 
                clubService.bulkApproveOrReject(request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a club (Admin only)")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COLLEGE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return ResponseEntity.ok(ApiResponse.success("Club deactivated successfully", null));
    }
}
