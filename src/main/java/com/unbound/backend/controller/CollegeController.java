package com.unbound.backend.controller;

import com.unbound.backend.entity.College;
import com.unbound.backend.entity.User;
import com.unbound.backend.repository.CollegeRepository;
import com.unbound.backend.dto.CollegePaymentConfigRequest;
import com.unbound.backend.exception.CollegeNotFoundException;
import com.unbound.backend.exception.ForbiddenActionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import jakarta.validation.Valid;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.unbound.backend.dto.CollegeProfileUpdateRequest;

@RestController
@RequestMapping("/api/college")
@Tag(name = "College Management APIs", description = "APIs for college management and configuration")
@SecurityRequirement(name = "bearerAuth")
public class CollegeController {
    @Autowired
    private CollegeRepository collegeRepository;

    private static final Logger logger = LoggerFactory.getLogger(CollegeController.class);

    @PostMapping("/payment-config")
    @Operation(summary = "Configure college payment settings", description = "Allows colleges to set up their payment receiving details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment configuration updated successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can configure payment settings"),
        @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> configurePaymentSettings(@AuthenticationPrincipal User user, 
                                                   @Valid @RequestBody CollegePaymentConfigRequest request) {
        logger.info("[POST] /api/college/payment-config called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.error("User is null or not a college: {}", user);
            throw new ForbiddenActionException("Only colleges can configure payment settings");
        }
        if (user.getUid() == null) {
            logger.error("Authenticated user has null UID: {}", user);
            throw new CollegeNotFoundException("Authenticated user has no UID. Please contact support.");
        }
        College college = collegeRepository.findByUserUid(user.getUid()).orElse(null);
        if (college == null) {
            logger.error("College not found for user: {} (uid={})", user.getEmail(), user.getUid());
            throw new CollegeNotFoundException("College not found for the authenticated user. Please contact support.");
        }
        if (college.getUser() == null) {
            logger.error("College entity has null user field: {}", college);
            throw new CollegeNotFoundException("College record is missing user reference. Please contact support.");
        }
        
        // Update college payment configuration
        college.setRazorpayAccountId(request.getRazorpayAccountId());
        college.setBankAccountNumber(request.getBankAccountNumber());
        college.setBankIfscCode(request.getBankIfscCode());
        college.setBankAccountHolderName(request.getBankAccountHolderName());
        college.setContactEmail(request.getContactEmail());
        
        collegeRepository.save(college);
        logger.info("Payment configuration updated for college: {} (uid={})", college.getCname(), user.getUid());
        
        return ResponseEntity.ok(Map.of(
            "message", "Payment configuration updated successfully",
            "collegeName", college.getCname(),
            "razorpayAccountId", college.getRazorpayAccountId(),
            "bankAccountNumber", college.getBankAccountNumber(),
            "bankIfscCode", college.getBankIfscCode(),
            "bankAccountHolderName", college.getBankAccountHolderName(),
            "contactEmail", college.getContactEmail()
        ));
    }

    @GetMapping("/payment-config")
    @Operation(summary = "Get college payment settings", description = "Retrieves the current payment configuration for the college")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Payment configuration retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can view payment settings"),
        @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getPaymentSettings(@AuthenticationPrincipal User user) {
        logger.info("[GET] /api/college/payment-config called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.error("User is null or not a college: {}", user);
            throw new ForbiddenActionException("Only colleges can view payment settings");
        }
        if (user.getUid() == null) {
            logger.error("Authenticated user has null UID: {}", user);
            throw new CollegeNotFoundException("Authenticated user has no UID. Please contact support.");
        }
        College college = collegeRepository.findByUserUid(user.getUid()).orElse(null);
        if (college == null) {
            logger.error("College not found for user: {} (uid={})", user.getEmail(), user.getUid());
            throw new CollegeNotFoundException("College not found for the authenticated user. Please contact support.");
        }
        if (college.getUser() == null) {
            logger.error("College entity has null user field: {}", college);
            throw new CollegeNotFoundException("College record is missing user reference. Please contact support.");
        }
        
        logger.info("Payment configuration fetched for college: {} (uid={})", college.getCname(), user.getUid());
        return ResponseEntity.ok(Map.of(
            "collegeName", college.getCname(),
            "razorpayAccountId", college.getRazorpayAccountId(),
            "bankAccountNumber", college.getBankAccountNumber(),
            "bankIfscCode", college.getBankIfscCode(),
            "bankAccountHolderName", college.getBankAccountHolderName(),
            "contactEmail", college.getContactEmail(),
            "isConfigured", college.getRazorpayAccountId() != null && !college.getRazorpayAccountId().isEmpty()
        ));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get college profile information", description = "Retrieves the profile information for the authenticated college")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "College profile retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can view their profile"),
        @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> getCollegeProfile(@AuthenticationPrincipal User user) {
        logger.info("[GET] /api/college/profile called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.error("User is null or not a college: {}", user);
            throw new ForbiddenActionException("Only colleges can view their profile");
        }
        if (user.getUid() == null) {
            logger.error("Authenticated user has null UID: {}", user);
            throw new CollegeNotFoundException("Authenticated user has no UID. Please contact support.");
        }
        College college = collegeRepository.findByUserUid(user.getUid()).orElse(null);
        if (college == null) {
            logger.error("College not found for user: {} (uid={})", user.getEmail(), user.getUid());
            throw new CollegeNotFoundException("College not found for the authenticated user. Please contact support.");
        }
        if (college.getUser() == null) {
            logger.error("College entity has null user field: {}", college);
            throw new CollegeNotFoundException("College record is missing user reference. Please contact support.");
        }
        
        logger.info("College profile fetched for: {} (uid={})", college.getCname(), user.getUid());
        Map<String, Object> response = new HashMap<>();
        response.put("collegeId", college.getCid());
        response.put("collegeName", college.getCname());
        response.put("description", college.getCdescription());
        response.put("address", college.getAddress());
        response.put("contactEmail", college.getContactEmail());
        response.put("userEmail", college.getUser().getEmail());
        response.put("createdAt", college.getUser().getCreatedAt());
        response.put("paymentConfigured", college.getRazorpayAccountId() != null && !college.getRazorpayAccountId().isEmpty());
        response.put("razorpayAccountId", college.getRazorpayAccountId());
        response.put("bankAccountNumber", college.getBankAccountNumber());
        response.put("bankIfscCode", college.getBankIfscCode());
        response.put("bankAccountHolderName", college.getBankAccountHolderName());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update college profile information", description = "Allows colleges to update their profile information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "College profile updated successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can update their profile"),
        @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> updateCollegeProfile(@AuthenticationPrincipal User user, 
                                               @Valid @RequestBody CollegeProfileUpdateRequest request) {
        logger.info("[PUT] /api/college/profile called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.error("User is null or not a college: {}", user);
            throw new ForbiddenActionException("Only colleges can update their profile");
        }
        if (user.getUid() == null) {
            logger.error("Authenticated user has null UID: {}", user);
            throw new CollegeNotFoundException("Authenticated user has no UID. Please contact support.");
        }
        College college = collegeRepository.findByUserUid(user.getUid()).orElse(null);
        if (college == null) {
            logger.error("College not found for user: {} (uid={})", user.getEmail(), user.getUid());
            throw new CollegeNotFoundException("College not found for the authenticated user. Please contact support.");
        }
        if (college.getUser() == null) {
            logger.error("College entity has null user field: {}", college);
            throw new CollegeNotFoundException("College record is missing user reference. Please contact support.");
        }
        
        // Update college profile information
        if (request.getCname() != null && !request.getCname().trim().isEmpty()) {
            college.setCname(request.getCname());
        }
        if (request.getCdescription() != null) {
            college.setCdescription(request.getCdescription());
        }
        if (request.getAddress() != null) {
            college.setAddress(request.getAddress());
        }
        if (request.getContactEmail() != null && !request.getContactEmail().trim().isEmpty()) {
            college.setContactEmail(request.getContactEmail());
        }
        
        collegeRepository.save(college);
        logger.info("College profile updated for: {} (uid={})", college.getCname(), user.getUid());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "College profile updated successfully");
        response.put("collegeId", college.getCid());
        response.put("collegeName", college.getCname());
        response.put("description", college.getCdescription());
        response.put("address", college.getAddress());
        response.put("contactEmail", college.getContactEmail());
        response.put("userEmail", college.getUser().getEmail());
        response.put("createdAt", college.getUser().getCreatedAt());
        response.put("paymentConfigured", college.getRazorpayAccountId() != null && !college.getRazorpayAccountId().isEmpty());
        response.put("razorpayAccountId", college.getRazorpayAccountId());
        response.put("bankAccountNumber", college.getBankAccountNumber());
        response.put("bankIfscCode", college.getBankIfscCode());
        response.put("bankAccountHolderName", college.getBankAccountHolderName());
        
        return ResponseEntity.ok(response);
    }
} 