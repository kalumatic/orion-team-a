package com.example.demo.controller;

import com.example.demo.dto.request.CreateEmployeeRequest;
import com.example.demo.dto.response.EmployeeResponse;
import com.example.demo.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * REST controller for Employee resources.
 * Exposes HTTP endpoints for creating employees and delegates business logic to EmployeeService.
 * Validates incoming request bodies using Bean Validation annotations.
 */

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse create(@Valid @RequestBody CreateEmployeeRequest request) {
        return employeeService.createEmployee(request);
    }

    @GetMapping
    public Page<EmployeeResponse> getAll(Pageable pageable) {
        return employeeService.getEmployees(pageable);
    }
}