package com.example.demo.controller;

import com.example.demo.dto.response.DeviceResponseDTO;
import com.example.demo.service.DeviceAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/devices/ai")
public class DeviceAIController {
    private final DeviceAIService aiService;

    public DeviceAIController(DeviceAIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<List<DeviceResponseDTO>> generate(@RequestParam(defaultValue = "1") int count) {
        try {
            return ResponseEntity.ok(aiService.generateDevices(count));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
