package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceRequestDTO {
    @NotBlank(message = "Device type is mandatory!")
    private String deviceType;

    @NotBlank(message = "Model is mandatory!")
    private String model;

    @NotBlank(message = "Serial number is mandatory!")
    private String serialNumber;

    @NotNull(message = "Assigned employee is mandatory!")
    private Long assignedEmployeeId;

    private LocalDate assignmentDate;
}
