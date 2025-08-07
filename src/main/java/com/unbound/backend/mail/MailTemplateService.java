package com.unbound.backend.mail;

import com.unbound.backend.entity.Student;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.EventRegistration;
import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.Team;
import com.unbound.backend.entity.College;
import com.unbound.backend.service.EmailService;
import com.unbound.backend.mail.templates.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MailTemplateService {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private RegistrationReceiptTemplate registrationReceiptTemplate;
    
    @Autowired
    private ForgotPasswordTemplate forgotPasswordTemplate;
    
    @Autowired
    private PaymentSuccessTemplate paymentSuccessTemplate;
    
    @Autowired
    private PaymentFailureTemplate paymentFailureTemplate;
    
    @Autowired
    private RefundNotificationTemplate refundNotificationTemplate;
    
    @Autowired
    private CollegePaymentNotificationTemplate collegePaymentNotificationTemplate;
    
    /**
     * Send registration receipt email with beautiful HTML template
     */
    public void sendRegistrationReceipt(Student student, Event event, EventRegistration registration, 
                                      String receiptNumber, String registrationType, Team team, Payment payment) {
        String emailBody = registrationReceiptTemplate.generateEmail(student, event, registration, 
                                                                   receiptNumber, registrationType, team, payment);
        emailService.sendHtmlEmail(
            student.getUser().getEmail(),
            "🎉 Registration Confirmation - " + event.getEname(),
            emailBody
        );
    }
    
    /**
     * Send forgot password email with beautiful HTML template
     */
    public void sendForgotPasswordEmail(String email, String resetToken, String resetLink) {
        String emailBody = forgotPasswordTemplate.generateEmail(email, resetToken, resetLink);
        emailService.sendHtmlEmail(
            email,
            "🔐 Password Reset Request - Unbound Platform",
            emailBody
        );
    }
    
    /**
     * Send payment success notification to student with beautiful HTML template
     */
    public void sendPaymentSuccessNotification(Payment payment, EventRegistration registration) {
        String emailBody = paymentSuccessTemplate.generateEmail(payment, registration);
        if (payment.getReceiptEmail() != null) {
            emailService.sendHtmlEmail(
                payment.getReceiptEmail(),
                "✅ Payment Success - Unbound Event Registration",
                emailBody
            );
        }
    }
    
    /**
     * Send payment failure notification to student with beautiful HTML template
     */
    public void sendPaymentFailureNotification(Payment payment, EventRegistration registration) {
        String emailBody = paymentFailureTemplate.generateEmail(payment, registration);
        if (payment.getReceiptEmail() != null) {
            emailService.sendHtmlEmail(
                payment.getReceiptEmail(),
                "❌ Payment Failed - Unbound Event Registration",
                emailBody
            );
        }
    }
    
    /**
     * Send refund notification to student with beautiful HTML template
     */
    public void sendRefundNotification(Payment payment) {
        String emailBody = refundNotificationTemplate.generateEmail(payment);
        if (payment.getReceiptEmail() != null) {
            emailService.sendHtmlEmail(
                payment.getReceiptEmail(),
                "💰 Payment Refund - Unbound Event Registration",
                emailBody
            );
        }
    }
    
    /**
     * Send payment notification to college with beautiful HTML template
     */
    public void sendCollegePaymentNotification(Payment payment, EventRegistration registration) {
        String emailBody = collegePaymentNotificationTemplate.generateEmail(payment, registration);
        College college = payment.getCollege();
        if (college.getContactEmail() != null) {
            emailService.sendHtmlEmail(
                college.getContactEmail(),
                "💳 New Payment Received - Event Registration",
                emailBody
            );
        }
    }
} 