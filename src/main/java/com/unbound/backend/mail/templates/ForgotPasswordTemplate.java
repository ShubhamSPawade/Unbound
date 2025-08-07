package com.unbound.backend.mail.templates;

import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class ForgotPasswordTemplate {
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public String generateEmail(String email, String resetToken, String resetLink) {
        Context context = new Context();
        
        // Set template variables
        context.setVariable("email", email);
        context.setVariable("resetToken", resetToken);
        context.setVariable("resetLink", resetLink);
        
        // Generate HTML using Thymeleaf template
        return templateEngine.process("email/forgot-password", context);
    }
} 