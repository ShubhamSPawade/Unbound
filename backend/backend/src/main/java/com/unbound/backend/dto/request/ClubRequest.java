package com.unbound.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClubRequest {

    @NotBlank(message = "Club name is required")
    @Size(min = 2, max = 100, message = "Club name must be between 2 and 100 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private String logoUrl;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid contact email format")
    private String contactEmail;
}
