package com.example.demo.service;

import com.example.demo.dto.request.CreateEmployeeRequest;
import com.example.demo.dto.response.EmployeeResponse;
import com.example.demo.entity.Employee;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * EmployeeService implementation.
 * Handles Employee creation logic, including duplicate email checks and persistence via EmployeeRepository.
 * Maps request DTOs to entities and entities to response DTOs.
 */

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Employee with this email already exists");
        }

        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());

        Employee saved = employeeRepository.save(employee);

        return new EmployeeResponse(
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail()
        );
    }

    @Override
    public Page<EmployeeResponse> getEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable)
                .map(e -> new EmployeeResponse(
                        e.getId(),
                        e.getFirstName(),
                        e.getLastName(),
                        e.getEmail()
                ));
    }
}