package com.unbound.backend.mail.templates;

import com.unbound.backend.entity.Payment;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class RefundNotificationTemplate {
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public String generateEmail(Payment payment) {
        Context context = new Context();
        
        // Student details
        context.setVariable("studentName", payment.getEventRegistration().getStudent().getSname());
        context.setVariable("studentEmail", payment.getEventRegistration().getStudent().getUser().getEmail());
        
        // Payment details
        context.setVariable("originalAmount", payment.getAmount());
        context.setVariable("refundAmount", payment.getRefundAmount() != null ? payment.getRefundAmount() : payment.getAmount());
        context.setVariable("orderId", payment.getRazorpayOrderId());
        context.setVariable("transactionId", payment.getPaymentId());
        context.setVariable("paymentDate", payment.getCreatedAt().toString());
        context.setVariable("refundDate", payment.getRefundedAt() != null ? payment.getRefundedAt().toString() : "N/A");
        context.setVariable("paymentCurrency", payment.getCurrency());
        context.setVariable("refundReason", payment.getRefundReason());
        
        // Event details
        context.setVariable("eventName", payment.getEventRegistration().getEvent().getEname());
        context.setVariable("eventDate", payment.getEventRegistration().getEvent().getEventDate().toString());
        context.setVariable("eventLocation", payment.getEventRegistration().getEvent().getLocation());
        context.setVariable("eventCategory", payment.getEventRegistration().getEvent().getCategory());
        context.setVariable("eventMode", payment.getEventRegistration().getEvent().getMode());
        context.setVariable("eventFees", payment.getEventRegistration().getEvent().getFees());
        
        // Registration details
        context.setVariable("registrationType", payment.getEventRegistration().getTeam() != null ? "TEAM" : "SOLO");
        context.setVariable("registrationDate", payment.getEventRegistration().getErdateTime().toString());
        
        // Team details (if applicable)
        if (payment.getEventRegistration().getTeam() != null) {
            context.setVariable("teamName", payment.getEventRegistration().getTeam().getTname());
        }
        
        // College details
        context.setVariable("collegeName", payment.getEventRegistration().getEvent().getCollege().getCname());
        
        // Generate HTML using Thymeleaf template
        return templateEngine.process("email/refund-notification", context);
    }
} 