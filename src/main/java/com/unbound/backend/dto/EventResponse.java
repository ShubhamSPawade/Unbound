package com.unbound.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventResponse {
    private Long eid;
    private String ename;
    private String edescription;
    private String eventDate;
    private Integer fees;
    private String location;
    private Integer capacity;
    private Boolean teamIsAllowed;
    private Integer minTeamSize;
    private Integer maxTeamSize;
    private String category;
    private String mode;
    private String posterUrl;
    private String posterThumbnailUrl;
    private boolean approved;
    private boolean active;
    
    // Prize fields
    private String cashPrize;
    private String firstPrize;
    private String secondPrize;
    private String thirdPrize;
    
    // Location fields
    private String city;
    private String state;
    private String country;
    
    // Contact and organizer fields
    private String eventWebsite;
    private String contactPhone;
    private String organizerName;
    private String organizerEmail;
    private String organizerPhone;
    
    // Event details
    private String rules;
    private String requirements;
    private String registrationDeadline;
    private Boolean registrationOpen;
    
    // Related data
    private String collegeName;
    private String collegeEmail;
    private String festName;
    private Integer registrationCount;
    private Integer daysLeft;
    private Boolean isRegistered; // For student context
    private String registrationStatus; // For student context
    private String paymentStatus; // For student context
} 