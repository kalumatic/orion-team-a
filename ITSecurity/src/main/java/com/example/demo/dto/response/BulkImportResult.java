package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BulkImportResult {
    private List<Long> successfulIds;
    private List<FailedEmployeeRecord> failed;
}
