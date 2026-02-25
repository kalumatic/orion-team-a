package com.example.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Request DTO for creating a new Employee.
 * Represents the JSON payload sent by clients and enforces input validation using Bean Validation.
 */

@Getter
@Setter
public class CreateEmployeeRequest {

    @NotBlank(message = "Firstname is mandatory")
    private String firstName;

    @NotBlank(message = "Lastname is mandatory")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email must be valid")
    private String email;
}