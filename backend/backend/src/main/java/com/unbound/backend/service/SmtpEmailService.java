package com.unbound.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class SmtpEmailService implements EmailService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");

    private final JavaMailSender mailSender;
    private final String fromEmail;
    private final String fromName;

    public SmtpEmailService(JavaMailSender mailSender,
            @Value("${spring.mail.username}") String fromEmail,
            @Value("${spring.mail.from-name:Unbound}") String fromName) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
        this.fromName = fromName == null || fromName.isBlank() ? "Unbound" : fromName;
    }

    @Override
    public void sendWelcomeEmail(String recipientEmail, String recipientName) {
        String subject = "Welcome to Unbound";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>Thank you for joining Unbound. Your account has been created successfully and you can now explore events, clubs, and more.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendEventRegistrationConfirmation(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate, String venue) {
        String subject = "Event Registration Confirmed";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>Your registration for <strong>" + escape(eventTitle) + "</strong> has been confirmed.</p>"
                + "<p><strong>Date:</strong> " + formatDate(eventDate) + "<br/>"
                + "<strong>Venue:</strong> " + escape(venue) + "</p>"
                + "<p>We look forward to seeing you there.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendEventRegistrationCancellation(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate, String venue) {
        String subject = "Event Registration Cancelled";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>Your registration for <strong>" + escape(eventTitle) + "</strong> has been cancelled.</p>"
                + "<p><strong>Date:</strong> " + formatDate(eventDate) + "<br/>"
                + "<strong>Venue:</strong> " + escape(venue) + "</p>"
                + "<p>If this was a mistake, you can register again from the event page.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendClubApprovalNotification(String recipientEmail, String recipientName, String clubName) {
        String subject = "Your Club Has Been Approved";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>Congratulations! Your club <strong>" + escape(clubName) + "</strong> has been approved.</p>"
                + "<p>You can now start creating events and engaging with students.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendClubRejectionNotification(String recipientEmail, String recipientName,
            String clubName, String rejectionReason) {
        String subject = "Club Request Rejected";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>We reviewed your club request for <strong>" + escape(clubName) + "</strong>.</p>"
                + "<p><strong>Reason:</strong> " + escape(rejectionReason) + "</p>"
                + "<p>Please review the feedback and submit an updated request when ready.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendEventPublishedNotification(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate) {
        String subject = "Your Event Has Been Published";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>Your event <strong>" + escape(eventTitle)
                + "</strong> is now published and visible to students.</p>"
                + "<p><strong>Date:</strong> " + formatDate(eventDate) + "</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendEventCancelledNotification(String recipientEmail, String recipientName,
            String eventTitle, LocalDateTime eventDate, String venue) {
        String subject = "Your Event Has Been Cancelled";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>Your event <strong>" + escape(eventTitle) + "</strong> has been cancelled.</p>"
                + "<p><strong>Date:</strong> " + formatDate(eventDate) + "<br/>"
                + "<strong>Venue:</strong> " + escape(venue) + "</p>"
                + "<p>Please reach out if you have any questions.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendPaymentSuccessNotification(String recipientEmail, String recipientName,
            String paymentReference, String amount) {
        String subject = "Payment Successful";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>Your payment has been processed successfully.</p>"
                + "<p><strong>Reference:</strong> " + escape(paymentReference) + "<br/>"
                + "<strong>Amount:</strong> " + escape(amount) + "</p>"
                + "<p>Thank you for using Unbound.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    @Override
    public void sendPaymentFailureNotification(String recipientEmail, String recipientName,
            String paymentReference, String failureReason) {
        String subject = "Payment Failed";
        String body = "<p>Hi " + escape(recipientName) + ",</p>"
                + "<p>We were unable to process your payment.</p>"
                + "<p><strong>Reference:</strong> " + escape(paymentReference) + "<br/>"
                + "<strong>Reason:</strong> " + escape(failureReason) + "</p>"
                + "<p>Please try again or contact support if you need help.</p>"
                + "<p>Best regards,<br/>The Unbound Team</p>";
        sendEmail(recipientEmail, subject, body);
    }

    private void sendEmail(String recipientEmail, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true for HTML

            mailSender.send(message);
            log.info("SMTP email sent successfully to {}: {}", recipientEmail, subject);
        } catch (MailException | MessagingException | UnsupportedEncodingException ex) {
            log.error("Failed to send email to {} via SMTP", recipientEmail, ex);
        }
    }

    private String formatDate(LocalDateTime eventDate) {
        return eventDate == null ? "TBD" : DATE_TIME_FORMATTER.format(eventDate);
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("<", "&lt;").replace(">", "&gt;");
    }
}