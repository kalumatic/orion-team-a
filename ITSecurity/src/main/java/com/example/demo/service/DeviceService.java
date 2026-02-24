package com.example.demo.service;

import com.example.demo.dto.DeviceRequestDTO;
import com.example.demo.dto.DeviceResponseDTO;

public interface DeviceService {
    DeviceResponseDTO createDevice(DeviceRequestDTO request);
}
