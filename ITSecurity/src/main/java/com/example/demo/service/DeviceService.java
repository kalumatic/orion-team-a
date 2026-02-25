package com.example.demo.service;

import com.example.demo.dto.DeviceRequestDTO;
import com.example.demo.dto.DeviceResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DeviceService {
    DeviceResponseDTO createDevice(DeviceRequestDTO request);
    byte[] exportDevicesCsv();
    DeviceResponseDTO updateDevice(Long id, DeviceRequestDTO request);
    DeviceResponseDTO getDeviceById(Long id);
    Page<DeviceResponseDTO> getAllDevices(Pageable pageable);
    DeviceResponseDTO deleteDevice(Long id);
}
