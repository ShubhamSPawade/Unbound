package com.unbound.backend.mail.templates;

import com.unbound.backend.entity.Student;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.EventRegistration;
import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.Team;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.web.servlet.ModelAndView;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class RegistrationReceiptTemplate {
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public String generateEmail(Student student, Event event, EventRegistration registration, 
                              String receiptNumber, String registrationType, Team team, Payment payment) {
        
        Context context = new Context();
        
        // Set all the template variables
        context.setVariable("studentName", student.getSname());
        context.setVariable("receiptNumber", receiptNumber);
        context.setVariable("registrationDate", registration.getErdateTime().toString());
        context.setVariable("registrationType", registrationType.toUpperCase());
        
        // Event details
        context.setVariable("eventName", event.getEname());
        context.setVariable("eventDate", event.getEventDate().toString());
        context.setVariable("eventLocation", event.getLocation());
        context.setVariable("eventCategory", event.getCategory());
        context.setVariable("eventMode", event.getMode());
        context.setVariable("eventFees", event.getFees());
        context.setVariable("eventRegistrationDeadline", event.getRegistrationDeadline().toString());
        
        // Prizes
        boolean hasPrizes = (event.getCashPrize() != null && !event.getCashPrize().isEmpty()) ||
                           (event.getFirstPrize() != null) ||
                           (event.getSecondPrize() != null) ||
                           (event.getThirdPrize() != null);
        context.setVariable("hasPrizes", hasPrizes);
        context.setVariable("cashPrize", event.getCashPrize());
        context.setVariable("firstPrize", event.getFirstPrize());
        context.setVariable("secondPrize", event.getSecondPrize());
        context.setVariable("thirdPrize", event.getThirdPrize());
        
        // Organizer details
        context.setVariable("collegeName", event.getCollege().getCname());
        context.setVariable("festName", event.getFest() != null ? event.getFest().getFname() : null);
        context.setVariable("organizerName", event.getOrganizerName());
        context.setVariable("organizerEmail", event.getOrganizerEmail());
        context.setVariable("organizerPhone", event.getOrganizerPhone());
        
        // Team details
        boolean isTeamRegistration = "team".equals(registrationType) && team != null;
        context.setVariable("isTeamRegistration", isTeamRegistration);
        if (isTeamRegistration) {
            context.setVariable("teamName", team.getTname());
            context.setVariable("teamCreator", team.getCreator().getSname());
        }
        
        // Event rules and requirements
        context.setVariable("eventRules", event.getRules());
        context.setVariable("eventRequirements", event.getRequirements());
        
        // Payment status
        context.setVariable("paymentStatus", registration.getPaymentStatus());
        
        // Payment details (if available)
        boolean hasPaymentDetails = payment != null;
        context.setVariable("hasPaymentDetails", hasPaymentDetails);
        if (hasPaymentDetails) {
            context.setVariable("orderId", payment.getRazorpayOrderId());
            context.setVariable("transactionId", payment.getPaymentId());
            context.setVariable("paymentAmount", payment.getAmount());
            context.setVariable("paymentCurrency", payment.getCurrency());
            context.setVariable("paymentDate", payment.getCreatedAt().toString());
            context.setVariable("paymentDescription", payment.getDescription());
        }
        
        // Generate HTML using Thymeleaf template
        return templateEngine.process("email/registration-receipt", context);
    }
} 