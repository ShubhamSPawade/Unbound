package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Email;

@Data
public class EventRequest {
    private Long eid;
    
    @NotBlank(message = "Event name is required")
    private String ename;
    
    @NotBlank(message = "Event description is required")
    private String edescription;
    
    @NotBlank(message = "Event date is required")
    private String eventDate;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Entry fee is required")
    @Min(value = 0, message = "Entry fee cannot be negative")
    private Integer fees;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
    @NotNull(message = "Team allowed status is required")
    private Boolean teamIsAllowed = false;
    
    @NotNull(message = "Minimum team size is required")
    @Min(value = 1, message = "Minimum team size must be at least 1")
    private Integer minTeamSize = 1;
    
    @NotNull(message = "Maximum team size is required")
    @Min(value = 1, message = "Maximum team size must be at least 1")
    private Integer maxTeamSize = 1;
    
    private Long fid; // Optional, for linking to a fest
    
    private String category; // e.g., Technical, Cultural, Sports, etc.
    private String mode; // Online, Offline
    private String posterUrl; // URL or path to event poster/banner
    
    // Prize fields
    private String cashPrize; // Cash prize amount and description
    private String firstPrize; // First prize details
    private String secondPrize; // Second prize details
    private String thirdPrize; // Third prize details
    
    // Location fields
    private String city; // City where event is held
    private String state; // State where event is held
    private String country; // Country where event is held
    
    // Contact and organizer fields
    private String eventWebsite; // Event specific website URL
    private String contactPhone; // Contact phone number
    private String organizerName; // Name of event organizer
    private String organizerEmail; // Email of event organizer
    private String organizerPhone; // Phone of event organizer
    
    // Event details
    private String rules; // Event rules and guidelines
    private String requirements; // Event requirements and prerequisites
    private String registrationDeadline; // Last date for registration
    private Boolean registrationOpen = true; // Whether registration is open
} 