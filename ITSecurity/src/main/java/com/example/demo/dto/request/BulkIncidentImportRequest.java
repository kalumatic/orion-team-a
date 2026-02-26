package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkIncidentImportRequest {
    private List<IncidentImportItem> incidents;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IncidentImportItem {
        private String description;
        private LocalDate incidentDate;
        private String severity;
        private String status;
        private String reporterEmail;
        private String deviceSerialNumber;
    }
}
