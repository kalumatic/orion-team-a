package com.example.demo.service;

import com.example.demo.dto.request.BulkImportRequest;
import com.example.demo.dto.request.CreateEmployeeRequest;
import com.example.demo.dto.request.UpdateEmployeeRequest;
import com.example.demo.dto.response.BulkImportResult;
import com.example.demo.dto.response.EmployeeResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

/**
 * Service contract for Employee-related business operations.
 * Defines methods that encapsulate business rules and coordinate persistence via repositories.
 */

public interface EmployeeService {
    EmployeeResponse createEmployee(CreateEmployeeRequest request);
    Page<EmployeeResponse> getEmployees(Pageable pageable);
    List<EmployeeResponse> getAllEmployees();
    EmployeeResponse getEmployeeById(Long id);
    EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request);
    void deleteEmployee(Long id);
    BulkImportResult importEmployees(BulkImportRequest request);
    String exportAll();
}