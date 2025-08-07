package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class CollegeProfileUpdateRequest {
    @NotBlank(message = "College name is required")
    @Size(min = 2, max = 100, message = "College name must be between 2 and 100 characters")
    private String cname;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String cdescription;
    
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Contact email is required")
    private String contactEmail;
} 