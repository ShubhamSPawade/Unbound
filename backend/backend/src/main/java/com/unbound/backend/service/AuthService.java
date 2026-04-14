package com.unbound.backend.service;

import com.unbound.backend.dto.request.LoginRequest;
import com.unbound.backend.dto.request.RegisterRequest;
import com.unbound.backend.dto.response.AuthResponse;
import com.unbound.backend.entity.College;
import com.unbound.backend.entity.User;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.repository.CollegeRepository;
import com.unbound.backend.repository.UserRepository;
import com.unbound.backend.security.JwtUtil;
import com.unbound.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already registered");
        }

        // Resolve college if provided
        College college = null;
        if (request.getCollegeId() != null) {
            college = collegeRepository.findById(request.getCollegeId())
                    .orElseThrow(() -> new BadRequestException("College not found with id: " + request.getCollegeId()));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .college(college)
                .department(request.getDepartment())
                .phone(request.getPhone())
                .isActive(true)
                .build();

        userRepository.save(user);
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        } catch (Exception ex) {
            log.warn("Welcome email failed for {}", user.getEmail(), ex);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
