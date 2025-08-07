package com.unbound.backend.exception;

public class CollegeNotFoundException extends RuntimeException {
    public CollegeNotFoundException(String message) {
        super(message);
    }
} 