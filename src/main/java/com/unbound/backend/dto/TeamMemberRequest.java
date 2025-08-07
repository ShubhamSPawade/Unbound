package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
public class TeamMemberRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;

    @NotBlank(message = "College name is required")
    private String college;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "Year is required")
    private Integer year;

    private Boolean isRegistered = false; // true if member is already registered on platform
    private Integer studentId; // only if isRegistered is true
} 