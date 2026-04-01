package com.unbound.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.unbound.backend.enums.ClubStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClubResponse {
    private Long id;
    private String name;
    private String description;
    private String logoUrl;
    private String category;
    private String contactEmail;
    private ClubStatus status;
    private String rejectionReason;
    private boolean isActive;
    private String collegeName;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
