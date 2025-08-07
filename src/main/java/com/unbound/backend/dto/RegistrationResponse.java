package com.unbound.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationResponse {
    private Long registrationId;
    private Long eventId;
    private Long teamId;
    private String eventName;
    private String eventDate;
    private String eventLocation;
    private Integer fees;
    private String registrationType; // "solo" or "team"
    private String teamName; // If team registration
    private String registrationStatus;
    private String paymentStatus;
    private String registrationDateTime;
    private String studentName;
    private String studentEmail;
    private String collegeName;
    private String festName;
    private String cashPrize;
    private String firstPrize;
    private String secondPrize;
    private String thirdPrize;
    private String registrationDeadline;
    private Integer daysLeft;
    private String receiptNumber; // For receipt generation
    private String message;
    private Boolean success;
} 