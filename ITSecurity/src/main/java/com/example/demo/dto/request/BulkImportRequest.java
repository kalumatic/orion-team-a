package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkImportRequest {
    private List<EmployeeImportItem> employees;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeImportItem {
        private String firstName;
        private String lastName;
        private String email;
    }
}