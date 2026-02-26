package com.example.demo.controller;

import com.example.demo.dto.request.BulkImportRequest;
import com.example.demo.dto.request.CreateEmployeeRequest;
import com.example.demo.dto.response.BulkImportResult;
import com.example.demo.dto.response.EmployeeResponse;
import com.example.demo.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

import com.example.demo.dto.request.UpdateEmployeeRequest;

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
    public EmployeeResponse createEmployee(@Valid @RequestBody CreateEmployeeRequest request) {
        return employeeService.createEmployee(request);
    }

    @GetMapping
    public Page<EmployeeResponse> getEmployees(Pageable pageable) {
        return employeeService.getEmployees(pageable);
    }

    @GetMapping("/all")
    public List<EmployeeResponse> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public EmployeeResponse getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponse updateEmployee(@PathVariable Long id, @Valid @RequestBody UpdateEmployeeRequest request) {
        return employeeService.updateEmployee(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }


    @GetMapping(value = "/bulk/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportAllEmployeesCsv() {
        String csv = employeeService.exportAll();
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"employees.csv\"")
                .contentType(new MediaType("text", "csv"))
                .contentLength(bytes.length)
                .body(bytes);
    }

    @PostMapping("/bulk/import")
    public ResponseEntity<BulkImportResult> importEmployees(
            @Valid @RequestBody BulkImportRequest request) {
        BulkImportResult result = employeeService.importEmployees(request);
        return ResponseEntity.ok(result);
    }
}