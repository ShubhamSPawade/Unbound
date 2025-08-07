package com.unbound.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send plain text email
     */
    public void sendEmail(String to, String subject, String body) {
        logger.info("[EMAIL] Sending plain text email to: {} with subject: {}", to, subject);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
        logger.info("[EMAIL] Plain text email sent to: {}", to);
    }

    /**
     * Send HTML email
     */
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        logger.info("[EMAIL] Sending HTML email to: {} with subject: {}", to, subject);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML content
            mailSender.send(message);
            logger.info("[EMAIL] HTML email sent to: {}", to);
        } catch (MessagingException e) {
            logger.error("[EMAIL] Failed to send HTML email to: {}", to, e);
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }

    /**
     * Send email with automatic detection of HTML content
     */
    public void sendEmail(String to, String subject, String body, boolean isHtml) {
        if (isHtml) {
            sendHtmlEmail(to, subject, body);
        } else {
            sendEmail(to, subject, body);
        }
    }
} 