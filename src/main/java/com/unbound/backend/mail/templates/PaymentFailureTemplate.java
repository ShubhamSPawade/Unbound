package com.unbound.backend.mail.templates;

import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.EventRegistration;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class PaymentFailureTemplate {
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public String generateEmail(Payment payment, EventRegistration registration) {
        Context context = new Context();
        
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
        
        // Error details
        context.setVariable("errorCode", payment.getErrorCode());
        context.setVariable("errorDescription", payment.getErrorDescription());
        
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
        
        // College details
        context.setVariable("collegeName", registration.getEvent().getCollege().getCname());
        
        // Retry link (you can customize this based on your frontend URL)
        context.setVariable("retryLink", "https://unbound.com/retry-payment?orderId=" + payment.getRazorpayOrderId());
        
        // Generate HTML using Thymeleaf template
        return templateEngine.process("email/payment-failure", context);
    }
} 