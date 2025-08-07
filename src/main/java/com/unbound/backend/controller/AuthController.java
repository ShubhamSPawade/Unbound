package com.unbound.backend.controller;

import com.unbound.backend.dto.RegisterRequest;
import com.unbound.backend.dto.LoginRequest;
import com.unbound.backend.dto.AuthResponse;
import com.unbound.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.unbound.backend.dto.ForgotPasswordRequest;
import com.unbound.backend.dto.ResetPasswordRequest;



import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication APIs")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Login with credentials")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    @Operation(summary = "Send reset password link to email")
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.sendResetPasswordLink(request.getEmail());
        return ResponseEntity.ok("Reset password link sent to email");
    }
    
    @Operation(summary = "Reset password using token")
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successful");
    }
}
