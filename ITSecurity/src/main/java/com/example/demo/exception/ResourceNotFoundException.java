package com.example.demo.exception;

/**
 * Exception thrown when a requested resource cannot be found.
 * Handled globally to return HTTP 404.
 */

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}