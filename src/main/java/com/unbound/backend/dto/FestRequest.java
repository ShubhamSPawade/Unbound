package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;

@Data
public class FestRequest {
    @NotBlank(message = "Fest name is required")
    private String fname;
    
    @NotBlank(message = "Fest description is required")
    private String fdescription;
    
    @NotBlank(message = "Start date is required")
    private String startDate;
    
    @NotBlank(message = "End date is required")
    private String endDate;
    
    // New fields with validation
    private String festImageUrl;
    private String festThumbnailUrl;
    private String city;
    private String state;
    private String country;
    private String mode;
    private String website;
    private String contactPhone;
} 