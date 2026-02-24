package com.example.demo.controller;

import com.example.demo.dto.DeviceRequestDTO;
import com.example.demo.dto.DeviceResponseDTO;
import com.example.demo.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceService service;

    public DeviceController(DeviceService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DeviceResponseDTO> create(@Valid @RequestBody DeviceRequestDTO request) {
        DeviceResponseDTO response = service.createDevice(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceResponseDTO> update(@PathVariable Long id, @Valid @RequestBody DeviceRequestDTO request) {
        DeviceResponseDTO response = service.updateDevice(id, request);
        return ResponseEntity.ok(response);
    }
}
