package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class IncidentResponseDTO {

    private Long id;
    private String description;
    private LocalDate incidentDate;
    private String severity;
    private String status;

    private String reporterName; // spojen firstName + lastName
    private String deviceInfo;   // spojen deviceType + model + serialNumber

}
