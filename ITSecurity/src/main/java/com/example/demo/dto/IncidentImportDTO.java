package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class IncidentImportDTO {

    @NotBlank(message = "Opis incidenta je obavezan")
    private String description;

    @NotNull(message = "Datum je obavezan")
    private LocalDate incidentDate;

    @NotBlank(message = "Severity je obavezan")
    private String severity;

    @NotBlank(message = "Status je obavezan")
    private String status;

    @NotNull(message = "Email je obavezan")
    private String email;

    @NotNull(message = "Device je obavezan")
    private String serialNumber;
}
