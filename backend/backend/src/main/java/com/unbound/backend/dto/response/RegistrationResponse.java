package com.unbound.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.unbound.backend.enums.RegistrationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegistrationResponse {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private String eventVenue;
    private LocalDateTime eventDate;
    private Long userId;
    private String userName;
    private String userEmail;
    private RegistrationStatus status;
    private LocalDateTime registrationDate;
}
