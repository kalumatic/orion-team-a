package com.example.demo.dto;

import com.example.demo.entity.Device;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceResponseDTO {
    private Long id;
    private String deviceType;
    private String model;
    private String serialNumber;
    private Long assignedEmployee;
    private LocalDate assignmentDate;

    public DeviceResponseDTO(Device device) {
        this.id = device.getId();
        this.deviceType = device.getDeviceType();
        this.model = device.getModel();
        this.serialNumber = device.getSerialNumber();
        this.assignedEmployee = device.getAssignedEmployee().getId();
        this.assignmentDate = device.getAssignmentDate();
    }
}
