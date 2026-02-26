package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkIncidentImportResult {

    private List<Long> successfulIds;
    private List<FailedIncidentRecord> failedRecords;
}