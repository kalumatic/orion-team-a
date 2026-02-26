package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FailedIncidentRecord {

    private String description;
    private LocalDate incidentDate;
    private String severity;
    private String status;
    private String reporterEmail;
    private String deviceSerialNumber;
    private String errorMessage;
}