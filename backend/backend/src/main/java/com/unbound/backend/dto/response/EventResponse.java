package com.unbound.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.unbound.backend.enums.EventCategory;
import com.unbound.backend.enums.EventStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String bannerUrl;
    private String venue;
    private LocalDateTime eventDate;
    private int maxParticipants;
    private int currentRegistrations;
    private EventCategory category;
    private EventStatus status;
    private Long festId;
    private String festName;
    private Long clubId;
    private String clubName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
