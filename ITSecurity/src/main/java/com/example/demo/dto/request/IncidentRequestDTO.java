package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IncidentRequestDTO {

    @NotBlank(message = "Opis incidenta je obavezan")
    private String description;

    @NotNull(message = "Datum je obavezan")
    private LocalDate incidentDate;

    @NotBlank(message = "Severity je obavezan")
    private String severity;

    @NotBlank(message = "Status je obavezan")
    private String status;

    @NotNull(message = "Reporter je obavezan")
    private Long reporterId;

    @NotNull(message = "Device je obavezan")
    private Long deviceId;

}
