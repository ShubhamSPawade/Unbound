package com.unbound.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private static final Logger logger = LoggerFactory.getLogger(PasswordService.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String hashPassword(String password) {
        logger.info("[PASSWORD] Hashing password");
        String hashed = encoder.encode(password);
        logger.info("[PASSWORD] Password hashed");
        return hashed;
    }

    public boolean matches(String rawPassword, String hashedPassword) {
        logger.info("[PASSWORD] Checking password match");
        boolean matches = encoder.matches(rawPassword, hashedPassword);
        logger.info("[PASSWORD] Password match result: {}", matches);
        return matches;
    }
} 