package com.unbound.backend.exception;

public class InvalidPaymentRequestException extends RuntimeException {
    public InvalidPaymentRequestException(String message) {
        super(message);
    }
    
    public InvalidPaymentRequestException(String message, Throwable cause) {
        super(message, cause);
    }
} 