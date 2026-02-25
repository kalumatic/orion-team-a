package com.example.demo.controller;

import com.example.demo.dto.BulkDeviceInsertResponseDTO;
import com.example.demo.dto.DeviceRequestDTO;
import com.example.demo.dto.DeviceResponseDTO;
import com.example.demo.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/bulk/import")
    public ResponseEntity<BulkDeviceInsertResponseDTO> createBulk(@RequestBody List<DeviceRequestDTO> requests) {
        BulkDeviceInsertResponseDTO response = service.createDevicesBulk(requests);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceResponseDTO> update(@PathVariable Long id, @Valid @RequestBody DeviceRequestDTO request) {
        DeviceResponseDTO response = service.updateDevice(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceResponseDTO> getById(@PathVariable Long id) {
        DeviceResponseDTO response = service.getDeviceById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<DeviceResponseDTO>> getAll(@PageableDefault(size = 10, sort = "id") Pageable pageable) {
        Page<DeviceResponseDTO> devices = service.getAllDevices(pageable);
        return ResponseEntity.ok(devices);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeviceResponseDTO> delete(@PathVariable Long id) {
        DeviceResponseDTO response = service.deleteDevice(id);
        return ResponseEntity.ok(response);
    }
}
