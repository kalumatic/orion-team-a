package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Response DTO for Employee data returned by the API.
 */

@Getter
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}