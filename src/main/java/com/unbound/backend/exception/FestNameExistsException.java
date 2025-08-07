package com.unbound.backend.exception;

public class FestNameExistsException extends RuntimeException {
    public FestNameExistsException(String message) {
        super(message);
    }
} 