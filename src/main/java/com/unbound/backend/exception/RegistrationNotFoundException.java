package com.unbound.backend.exception;

public class RegistrationNotFoundException extends RuntimeException {
    public RegistrationNotFoundException(String message) {
        super(message);
    }
    
    public RegistrationNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 