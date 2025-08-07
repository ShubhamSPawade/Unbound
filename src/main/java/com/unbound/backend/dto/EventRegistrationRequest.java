package com.unbound.backend.dto;

import lombok.Data;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class EventRegistrationRequest {
    @NotNull(message = "Please select an event to register for.")
    private Long eventId;
    @NotNull(message = "Please select a registration type (Solo or Team).")
    private String registrationType; // "solo" or "team"
    // For team registration
    private Long teamId; // for joining existing team
    private String teamName; // for creating new team
    private List<TeamMemberRequest> teamMembers; // for team registration with member details
} 