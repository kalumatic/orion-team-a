package com.example.demo.exception;

/**
 * Exception thrown when attempting to create a resource that violates uniqueness rules (duplicate email).
 * Handled globally to return a consistent HTTP error response.
 */

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}