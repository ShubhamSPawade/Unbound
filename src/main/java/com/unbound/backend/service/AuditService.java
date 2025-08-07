package com.unbound.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuditService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public void logUserAction(String userId, String action, String details) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[AUDIT] %s | User: %s | Action: %s | Details: %s", 
                timestamp, userId, action, details);
        logger.info(logMessage);
    }
    
    public void logSecurityEvent(String event, String details) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[SECURITY] %s | Event: %s | Details: %s", 
                timestamp, event, details);
        logger.warn(logMessage);
    }
    
    public void logSystemEvent(String event, String details) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[SYSTEM] %s | Event: %s | Details: %s", 
                timestamp, event, details);
        logger.info(logMessage);
    }
    
    public void logError(String error, String details, Throwable throwable) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[ERROR] %s | Error: %s | Details: %s", 
                timestamp, error, details);
        logger.error(logMessage, throwable);
    }
    
    public void logPaymentEvent(String userId, String paymentId, String event, String amount) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[PAYMENT] %s | User: %s | PaymentId: %s | Event: %s | Amount: %s", 
                timestamp, userId, paymentId, event, amount);
        logger.info(logMessage);
    }
    
    public void logRegistrationEvent(String userId, String eventId, String action) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[REGISTRATION] %s | User: %s | Event: %s | Action: %s", 
                timestamp, userId, eventId, action);
        logger.info(logMessage);
    }

    public void logAction(String action, String details) {
        logger.info("[AUDIT] Logging action: {} with details: {}", action, details);
        String timestamp = LocalDateTime.now().format(formatter);
        String logMessage = String.format("[AUDIT] %s | Action: %s | Details: %s", 
                timestamp, action, details);
        logger.info(logMessage);
        logger.info("[AUDIT] Action logged: {}", action);
    }
} 