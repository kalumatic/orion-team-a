package com.example.demo.service;

import com.example.demo.dto.response.BulkDeviceInsertResponseDTO;
import com.example.demo.dto.request.DeviceRequestDTO;
import com.example.demo.dto.response.DeviceResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DeviceService {
    DeviceResponseDTO createDevice(DeviceRequestDTO request);
    byte[] exportDevicesCsv();
    BulkDeviceInsertResponseDTO createDevicesBulk(List<DeviceRequestDTO> requests);
    DeviceResponseDTO updateDevice(Long id, DeviceRequestDTO request);
    DeviceResponseDTO getDeviceById(Long id);
    Page<DeviceResponseDTO> getAllDevices(Pageable pageable);
    List<DeviceResponseDTO> getAllDevicesList();
    DeviceResponseDTO deleteDevice(Long id);
}
