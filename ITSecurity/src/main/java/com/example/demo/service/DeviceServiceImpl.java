package com.example.demo.service;

import com.example.demo.dto.DeviceRequestDTO;
import com.example.demo.dto.DeviceResponseDTO;
import com.example.demo.entity.Device;
import com.example.demo.entity.Employee;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DeviceServiceImpl implements DeviceService {
    private final DeviceRepository deviceRepository;
    private final EmployeeRepository employeeRepository;

    public DeviceServiceImpl(DeviceRepository deviceRepository, EmployeeRepository employeeRepository) {
        this.deviceRepository = deviceRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public DeviceResponseDTO createDevice(DeviceRequestDTO dto) {
        // Find Employee by ID
        Employee employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee not found!"));

        // Map DTO to Device
        Device device = new Device();
        device.setDeviceType(dto.getDeviceType());
        device.setModel(dto.getModel());
        device.setSerialNumber(dto.getSerialNumber());
        device.setAssignedEmployee(employee);
        device.setAssignmentDate(dto.getAssignmentDate());

        if (deviceRepository.findBySerialNumber(dto.getSerialNumber()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Device with this serial number already exists!"
            );
        }

        // Save
        Device saved = deviceRepository.save(device);

        // Map Device to DTO
        return new DeviceResponseDTO(saved);
    }

    @Override
    public DeviceResponseDTO updateDevice(Long id, DeviceRequestDTO dto) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found!"));

        Employee employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Employee not found!"));

        if (!device.getSerialNumber().equals(dto.getSerialNumber())
                && deviceRepository.findBySerialNumber(dto.getSerialNumber()).isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Device with this serial number already exists!"
            );
        }

        device.setDeviceType(dto.getDeviceType());
        device.setModel(dto.getModel());
        device.setSerialNumber(dto.getSerialNumber());
        device.setAssignedEmployee(employee);
        device.setAssignmentDate(dto.getAssignmentDate());

        Device saved = deviceRepository.save(device);

        return new DeviceResponseDTO(saved);
    }

    @Override
    public DeviceResponseDTO getDeviceById(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found!"));

        return new DeviceResponseDTO(device);
    }

    @Override
    public Page<DeviceResponseDTO> getAllDevices(Pageable pageable) {
        Page<Device> devices = deviceRepository.findAll(pageable);
        return devices.map(DeviceResponseDTO::new);
    }

    @Override
    public DeviceResponseDTO deleteDevice(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found!"));

        deviceRepository.delete(device);

        return new DeviceResponseDTO(device);
    }
}
