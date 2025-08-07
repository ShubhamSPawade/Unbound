package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RegisterRequest {
    @NotBlank(message = "Please enter your email address.")
    @Email(message = "Please enter a valid email address.")
    private String email;
    @NotBlank(message = "Please enter a password.")
    @Size(min = 8, message = "Password must be at least 8 characters.")
    private String password;
    @NotBlank(message = "Please select a role.")
    private String role; // "Student" or "College"
    // For students
    private String sname;
    private Long collegeId;
    // For colleges
    private String cname;
    private String cdescription;
    private String address;
    private String contactEmail;
} 