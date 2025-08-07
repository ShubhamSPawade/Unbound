package com.unbound.backend.exception;

public class EventDateOutOfRangeException extends RuntimeException {
    public EventDateOutOfRangeException(String message) {
        super(message);
    }
} 