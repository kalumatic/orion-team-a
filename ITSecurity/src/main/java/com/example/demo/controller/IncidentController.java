package com.example.demo.controller;

import com.example.demo.dto.IncidentImportDTO;
import com.example.demo.dto.IncidentRequestDTO;
import com.example.demo.dto.IncidentResponseDTO;
import com.example.demo.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<IncidentResponseDTO> createIncident(@Valid @RequestBody IncidentRequestDTO dto) {
        IncidentResponseDTO saved = incidentService.createIncident(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/importIncident")
    public ResponseEntity<IncidentResponseDTO> importIncident(@Valid @RequestBody IncidentImportDTO dto) {
        IncidentResponseDTO saved = incidentService.importIncident(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<IncidentResponseDTO> getAllIncidents(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String serialNumber,
            @RequestParam(required = false) String deviceType
    ) {
        return incidentService.getAllIncidents(date, serialNumber, deviceType);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> getIncidentById(@PathVariable Long id) {
        IncidentResponseDTO incident = incidentService.getIncidentById(id);
        return ResponseEntity.ok(incident);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentRequestDTO dto
    ) {
        IncidentResponseDTO updated = incidentService.updateIncident(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
