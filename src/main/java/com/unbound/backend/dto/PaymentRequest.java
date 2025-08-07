package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
public class PaymentRequest {
    @NotNull(message = "Registration ID is required")
    @Min(value = 1, message = "Registration ID must be positive")
    private Long registrationId;
    
    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be greater than 0")
    private Integer amount;
    
    @NotNull(message = "Currency is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a 3-letter code (e.g., INR, USD)")
    private String currency = "INR";
    
    @NotNull(message = "Receipt email is required")
    @Email(message = "Invalid email format")
    private String receiptEmail;
    
    private String description; // Optional payment description
} 