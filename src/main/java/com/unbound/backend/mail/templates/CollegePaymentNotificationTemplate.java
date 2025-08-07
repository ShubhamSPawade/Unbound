package com.unbound.backend.mail.templates;

import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.EventRegistration;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class CollegePaymentNotificationTemplate {
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public String generateEmail(Payment payment, EventRegistration registration) {
        Context context = new Context();
        
        // College details
        context.setVariable("collegeName", payment.getCollege().getCname());
        context.setVariable("collegeEmail", payment.getCollege().getContactEmail());
        
        // Student details
        context.setVariable("studentName", registration.getStudent().getSname());
        context.setVariable("studentEmail", registration.getStudent().getUser().getEmail());
        
        // Payment details
        context.setVariable("paymentAmount", payment.getAmount());
        context.setVariable("orderId", payment.getRazorpayOrderId());
        context.setVariable("transactionId", payment.getPaymentId());
        context.setVariable("paymentDate", payment.getCreatedAt().toString());
        context.setVariable("paymentCurrency", payment.getCurrency());
        context.setVariable("paymentDescription", payment.getDescription());
        
        // Event details
        context.setVariable("eventName", registration.getEvent().getEname());
        context.setVariable("eventDate", registration.getEvent().getEventDate().toString());
        context.setVariable("eventLocation", registration.getEvent().getLocation());
        context.setVariable("eventCategory", registration.getEvent().getCategory());
        context.setVariable("eventMode", registration.getEvent().getMode());
        context.setVariable("eventFees", registration.getEvent().getFees());
        
        // Registration details
        context.setVariable("registrationType", registration.getTeam() != null ? "TEAM" : "SOLO");
        context.setVariable("registrationDate", registration.getErdateTime().toString());
        
        // Team details (if applicable)
        if (registration.getTeam() != null) {
            context.setVariable("teamName", registration.getTeam().getTname());
        }
        
        // Statistics (you can customize these based on your requirements)
        context.setVariable("totalRegistrations", "25"); // This should come from your service
        context.setVariable("paidRegistrations", "20");
        context.setVariable("totalRevenue", "10,000");
        context.setVariable("pendingPayments", "5");
        
        // Generate HTML using Thymeleaf template
        return templateEngine.process("email/college-payment-notification", context);
    }
} 