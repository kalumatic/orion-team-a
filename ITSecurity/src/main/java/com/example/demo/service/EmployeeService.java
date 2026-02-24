package com.example.demo.service;

import com.example.demo.dto.request.CreateEmployeeRequest;
import com.example.demo.dto.response.EmployeeResponse;

/**
 * Service contract for Employee-related business operations.
 * Defines methods that encapsulate business rules and coordinate persistence via repositories.
 */

public interface EmployeeService {
    EmployeeResponse createEmployee(CreateEmployeeRequest request);
}