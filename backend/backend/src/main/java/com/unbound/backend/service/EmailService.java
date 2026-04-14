package com.unbound.backend.service;

import java.time.LocalDateTime;

public interface EmailService {

    void sendWelcomeEmail(String recipientEmail, String recipientName);

    void sendEventRegistrationConfirmation(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate, String venue);

    void sendEventRegistrationCancellation(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate, String venue);

    void sendClubApprovalNotification(String recipientEmail, String recipientName, String clubName);

    void sendClubRejectionNotification(String recipientEmail, String recipientName,
            String clubName, String rejectionReason);

    void sendEventPublishedNotification(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate);

    void sendEventCancelledNotification(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate, String venue);

    void sendPaymentSuccessNotification(String recipientEmail, String recipientName,
            String paymentReference, String amount);

    void sendPaymentFailureNotification(String recipientEmail, String recipientName,
            String paymentReference, String failureReason);
}
