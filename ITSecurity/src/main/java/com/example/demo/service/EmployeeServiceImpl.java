package com.example.demo.service;

import com.example.demo.dto.request.BulkImportRequest;
import com.example.demo.dto.request.CreateEmployeeRequest;
import com.example.demo.dto.response.BulkImportResult;
import com.example.demo.dto.response.EmployeeResponse;
import com.example.demo.dto.response.FailedEmployeeRecord;
import com.example.demo.entity.Employee;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.dto.request.UpdateEmployeeRequest;
import com.example.demo.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;

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

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(e -> new EmployeeResponse(
                        e.getId(),
                        e.getFirstName(),
                        e.getLastName(),
                        e.getEmail()
                ))
                .toList();
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " not found"));

        return new EmployeeResponse(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail()
        );
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " not found"));

        if (employeeRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new DuplicateResourceException("Employee with this email already exists");
        }

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
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " not found"));

        employeeRepository.delete(employee);
    }

    @Override
    public String exportAll() {
        List<EmployeeResponse> employees = getAllEmployees();
        StringBuilder csv = new StringBuilder();
        csv.append("id,firstName,lastName,email\n");

        for (EmployeeResponse employee : employees) {
            csv.append(employee.getId()).append(",")
                    .append(employee.getFirstName()).append(",")
                    .append(employee.getLastName()).append(",")
                    .append(employee.getEmail()).append("\n");
        }
        return csv.toString();
    }

    @Override
    public BulkImportResult importEmployees(BulkImportRequest request) {
        List<Long> successfulIds = new ArrayList<>();
        List<FailedEmployeeRecord> failedRecords = new ArrayList<>();

        for (BulkImportRequest.EmployeeImportItem item : request.getEmployees()) {
            try {
                if (item.getFirstName() == null || item.getFirstName().isBlank()) {
                    failedRecords.add(new FailedEmployeeRecord(
                            item.getFirstName(), item.getLastName(), item.getEmail(),
                            "First name is required"
                    ));
                    continue;
                }

                if (item.getLastName() == null || item.getLastName().isBlank()) {
                    failedRecords.add(new FailedEmployeeRecord(
                            item.getFirstName(), item.getLastName(), item.getEmail(),
                            "Last name is required"
                    ));
                    continue;
                }

                if (employeeRepository.existsByEmail(item.getEmail())) {
                    failedRecords.add(new FailedEmployeeRecord(
                            item.getFirstName(), item.getLastName(), item.getEmail(),
                            "Employee with this email already exists"
                    ));
                    continue;
                }

                Employee employee = new Employee();
                employee.setFirstName(item.getFirstName());
                employee.setLastName(item.getLastName());
                employee.setEmail(item.getEmail());

                Employee saved = employeeRepository.save(employee);
                successfulIds.add(saved.getId());

            } catch (Exception e) {
                failedRecords.add(new FailedEmployeeRecord(
                        item.getFirstName(), item.getLastName(), item.getEmail(),
                        "Database error: " + e.getMessage()
                ));
            }
        }

        return new BulkImportResult(successfulIds, failedRecords);
    }
}