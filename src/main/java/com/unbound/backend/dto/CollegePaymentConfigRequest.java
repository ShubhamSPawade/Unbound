package com.unbound.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class CollegePaymentConfigRequest {
    
    @NotBlank(message = "Please enter your Razorpay Account ID.")
    private String razorpayAccountId;
    
    @NotBlank(message = "Please enter your bank account number.")
    private String bankAccountNumber;
    
    @NotBlank(message = "Please enter your bank IFSC code.")
    private String bankIfscCode;
    
    @NotBlank(message = "Please enter the bank account holder's name.")
    private String bankAccountHolderName;
    
    @NotBlank(message = "Please enter a contact email for payments.")
    private String contactEmail;
} 