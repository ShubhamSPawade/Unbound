package com.unbound.backend.controller;

import com.unbound.backend.dto.request.FestRequest;
import com.unbound.backend.dto.response.ApiResponse;
import com.unbound.backend.dto.response.FestResponse;
import com.unbound.backend.service.FestService;
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
@RequestMapping("/api/fests")
@RequiredArgsConstructor
@Tag(name = "Fests", description = "Fest management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class FestController {

    private final FestService festService;

    // COLLEGE_ADMIN and SUPER_ADMIN only
    @PostMapping
    @Operation(summary = "Create a new fest (Admin only)")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<FestResponse>> createFest(@Valid @RequestBody FestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Fest created successfully", festService.createFest(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a fest (Admin only)")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<FestResponse>> updateFest(
            @PathVariable Long id, @Valid @RequestBody FestRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Fest updated successfully", festService.updateFest(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a fest (Admin only)")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFest(@PathVariable Long id) {
        festService.deleteFest(id);
        return ResponseEntity.ok(ApiResponse.success("Fest deleted successfully", null));
    }

    // Any authenticated user
    @GetMapping
    @Operation(summary = "Get all fests")
    public ResponseEntity<ApiResponse<List<FestResponse>>> getAllFests() {
        return ResponseEntity.ok(ApiResponse.success("Fests fetched", festService.getAllFests()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get fest by ID")
    public ResponseEntity<ApiResponse<FestResponse>> getFestById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Fest fetched", festService.getFestById(id)));
    }

    @GetMapping("/college/{collegeId}")
    @Operation(summary = "Get all fests by college")
    public ResponseEntity<ApiResponse<List<FestResponse>>> getFestsByCollege(@PathVariable Long collegeId) {
        return ResponseEntity.ok(ApiResponse.success("Fests fetched", festService.getFestsByCollege(collegeId)));
    }
}
