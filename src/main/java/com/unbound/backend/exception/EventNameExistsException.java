package com.unbound.backend.exception;

public class EventNameExistsException extends RuntimeException {
    public EventNameExistsException(String message) {
        super(message);
    }
} 