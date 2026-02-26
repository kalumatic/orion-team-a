package com.example.demo.service;

import com.example.demo.dto.request.BulkImportRequest;
import com.example.demo.dto.request.CreateEmployeeRequest;
import com.example.demo.dto.response.BulkImportResult;
import com.example.demo.entity.Employee;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void createEmployee_success() {
        CreateEmployeeRequest req = new CreateEmployeeRequest();
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setEmail("john.doe@example.com");

        when(employeeRepository.existsByEmail(req.getEmail())).thenReturn(false);

        Employee saved = new Employee();
        saved.setId(1L);
        saved.setFirstName(req.getFirstName());
        saved.setLastName(req.getLastName());
        saved.setEmail(req.getEmail());

        when(employeeRepository.save(any(Employee.class))).thenReturn(saved);

        var resp = employeeService.createEmployee(req);

        assertNotNull(resp);
        assertEquals(1L, resp.getId());
        assertEquals("John", resp.getFirstName());
        assertEquals("Doe", resp.getLastName());
        assertEquals("john.doe@example.com", resp.getEmail());

        verify(employeeRepository).existsByEmail(req.getEmail());
        verify(employeeRepository).save(any(Employee.class));
    }

    @Test
    void createEmployee_duplicateEmail_throws() {
        CreateEmployeeRequest req = new CreateEmployeeRequest();
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setEmail("john.doe@example.com");

        when(employeeRepository.existsByEmail(req.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> employeeService.createEmployee(req));

        verify(employeeRepository).existsByEmail(req.getEmail());
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void importEmployees_mixedRecords() {
        var validItem = new BulkImportRequest.EmployeeImportItem("Marko", "Markovic", "marko@example.com");
        var missingFirst = new BulkImportRequest.EmployeeImportItem("", "Jankovic", "janko@example.com");
        var duplicateEmail = new BulkImportRequest.EmployeeImportItem("Ivana", "Ivic", "existing@example.com");
        var dbErrorItem = new BulkImportRequest.EmployeeImportItem("Petar", "Peric", "petar@example.com");

        var request = new BulkImportRequest(List.of(validItem, missingFirst, duplicateEmail, dbErrorItem));

        when(employeeRepository.existsByEmail("marko@example.com")).thenReturn(false);
        when(employeeRepository.existsByEmail("janko@example.com")).thenReturn(false);
        when(employeeRepository.existsByEmail("existing@example.com")).thenReturn(true);
        when(employeeRepository.existsByEmail("petar@example.com")).thenReturn(false);

        Employee saved = new Employee();
        saved.setId(10L);
        saved.setFirstName("Marko");
        saved.setLastName("Markovic");
        saved.setEmail("marko@example.com");

        when(employeeRepository.save(argThat(e -> "marko@example.com".equals(e.getEmail())))).thenReturn(saved);
        when(employeeRepository.save(argThat(e -> "petar@example.com".equals(e.getEmail()))))
                .thenThrow(new RuntimeException("DB down"));

        BulkImportResult result = employeeService.importEmployees(request);

        assertNotNull(result);
        assertEquals(1, result.getSuccessfulIds().size(), "Only one record should be successful");
        assertEquals(10L, result.getSuccessfulIds().get(0));

        assertEquals(3, result.getFailed().size(), "Three records should have failed (missing first, duplicate, db error)");

        boolean hasMissingFirst = result.getFailed().stream().anyMatch(f -> f.getReason().contains("First name"));
        boolean hasDuplicate = result.getFailed().stream().anyMatch(f -> f.getReason().contains("already exists"));
        boolean hasDbError = result.getFailed().stream().anyMatch(f -> f.getReason().contains("Database error"));

        assertTrue(hasMissingFirst, "Should contain missing first name failure");
        assertTrue(hasDuplicate, "Should contain duplicate email failure");
        assertTrue(hasDbError, "Should contain database error failure");

        verify(employeeRepository).existsByEmail("marko@example.com");
        verify(employeeRepository).existsByEmail("existing@example.com");
        verify(employeeRepository).existsByEmail("petar@example.com");
        verify(employeeRepository).save(any(Employee.class));
    }
}