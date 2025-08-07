package com.unbound.backend.service;

import com.unbound.backend.dto.RegisterRequest;
import com.unbound.backend.dto.LoginRequest;
import com.unbound.backend.dto.AuthResponse;
import com.unbound.backend.entity.User;
import com.unbound.backend.entity.Student;
import com.unbound.backend.entity.College;
import com.unbound.backend.repository.UserRepository;
import com.unbound.backend.repository.StudentRepository;
import com.unbound.backend.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Value;
import com.unbound.backend.entity.PasswordResetToken;
import com.unbound.backend.repository.PasswordResetTokenRepository;

import jakarta.persistence.EntityNotFoundException;
import com.unbound.backend.exception.EmailNotFoundException;
import com.unbound.backend.exception.IncorrectPasswordException;
import com.unbound.backend.exception.EmailAlreadyRegisteredException;
import com.unbound.backend.mail.MailTemplateService;

import java.util.Optional;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CollegeRepository collegeRepository;
    @Autowired
    private PasswordService passwordService;
    @Autowired
    private JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        logger.info("[REGISTER] Attempting to register user: {} with role: {}", request.getEmail(), request.getRole());
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyRegisteredException("This email is already registered. Please log in or use a different email.");
        }
        User.Role role = User.Role.valueOf(request.getRole());
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordService.hashPassword(request.getPassword()))
                .role(role)
                .createdAt(new java.sql.Timestamp(System.currentTimeMillis()))
                .build();
        user = userRepository.save(user);
        String sname = null, cname = null;
        if (role == User.Role.Student) {
            Long collegeId = request.getCollegeId();
            College college = collegeRepository.findById(collegeId).orElseThrow(() -> new RuntimeException("College not found"));
            Student student = Student.builder()
                    .sname(request.getSname())
                    .user(user)
                    .college(college)
                    .build();
            studentRepository.save(student);
            sname = student.getSname();
        } else if (role == User.Role.College) {
            College college = College.builder()
                    .user(user)
                    .cname(request.getCname())
                    .cdescription(request.getCdescription())
                    .address(request.getAddress())
                    .contactEmail(request.getContactEmail())
                    .build();
            collegeRepository.save(college);
            cname = college.getCname();
        } else if (role == User.Role.Admin) {
            // Admin users don't have associated Student or College entities
            // They only have the User entity with Admin role
            // No additional entity creation needed
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        logger.info("[REGISTER] User registered successfully: {} with role: {}", user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getRole().name(), user.getEmail(), sname, cname);
    }

    public AuthResponse login(LoginRequest request) {
        logger.info("[LOGIN] Attempting login for user: {}", request.getEmail());
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            throw new EmailNotFoundException("Email not found");
        }
        if (!passwordService.matches(request.getPassword(), user.getPassword())) {
            throw new IncorrectPasswordException("Incorrect password");
        }
        String sname = null, cname = null;
        if (user.getRole() == User.Role.Student) {
            Student student = studentRepository.findAll().stream()
                    .filter(s -> s.getUser().getUid().equals(user.getUid()))
                    .findFirst().orElse(null);
            if (student != null) sname = student.getSname();
        } else if (user.getRole() == User.Role.College) {
            College college = collegeRepository.findAll().stream()
                    .filter(c -> c.getUser().getUid().equals(user.getUid()))
                    .findFirst().orElse(null);
            if (college != null) cname = college.getCname();
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        logger.info("[LOGIN] Login successful for user: {}", user.getEmail());
        return new AuthResponse(token, user.getRole().name(), user.getEmail(), sname, cname);
    }
    
    @Value("${frontend.reset-password-url}")
    private String resetPasswordBaseUrl;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private MailTemplateService mailTemplateService;
    
    @Transactional
    public void sendResetPasswordLink(String email) {
        logger.info("[FORGOT PASSWORD] Attempting to send reset link to: {}", email);
        Optional<User> userOpt = userRepository.findByEmail(email);
    
        if (userOpt.isEmpty()) {
            throw new EmailNotFoundException("Email not found");
        }
    
        User user = userOpt.get();
    
        // Delete any existing token for this user to avoid unique constraint violation
        passwordResetTokenRepository.deleteByUser(user);
        String token = java.util.UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();
    
        passwordResetTokenRepository.save(resetToken);
    
        String resetLink = resetPasswordBaseUrl + "?token=" + token;
        mailTemplateService.sendForgotPasswordEmail(user.getEmail(), token, resetLink);
        logger.info("[FORGOT PASSWORD] Reset link sent to: {}", email);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
    
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }
    
        User user = resetToken.getUser();
        user.setPassword(passwordService.hashPassword(newPassword));
        userRepository.save(user);
    
        passwordResetTokenRepository.delete(resetToken);
    }

} 
