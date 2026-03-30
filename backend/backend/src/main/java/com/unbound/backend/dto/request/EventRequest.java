package com.unbound.backend.dto.request;

import com.unbound.backend.enums.EventCategory;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be between 2 and 100 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private String bannerUrl;

    private String venue;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDateTime eventDate;

    @NotNull(message = "Max participants is required")
    @Min(value = 1, message = "Max participants must be at least 1")
    private Integer maxParticipants;

    @NotNull(message = "Category is required")
    private EventCategory category;

    // Optional — event can be standalone (not part of a fest)
    private Long festId;

    @NotNull(message = "Club ID is required")
    private Long clubId;
}
