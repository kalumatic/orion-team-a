package com.example.demo.controller;

import com.example.demo.dto.request.AiIncidentGenerateRequest;
import com.example.demo.dto.request.IncidentImportRequest;
import com.example.demo.dto.request.IncidentRequestDTO;
import com.example.demo.dto.response.AiIncidentGenerateResponse;
import com.example.demo.dto.request.BulkIncidentImportRequest;
import com.example.demo.dto.request.IncidentImportRequest;
import com.example.demo.dto.request.IncidentRequestDTO;
import com.example.demo.dto.response.BulkIncidentImportResult;
import com.example.demo.dto.response.IncidentResponseDTO;
import com.example.demo.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    public ResponseEntity<IncidentResponseDTO> importIncident(@Valid @RequestBody IncidentImportRequest dto) {
        IncidentResponseDTO saved = incidentService.importIncident(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/ai-generate")
    public ResponseEntity<AiIncidentGenerateResponse> generateWithAi(@Valid @RequestBody AiIncidentGenerateRequest request) {
        AiIncidentGenerateResponse response = incidentService.generateIncidentsWithAi(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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

    @PostMapping(value = "/bulk/import", consumes = "application/json", produces = "application/json")
    public ResponseEntity<BulkIncidentImportResult> importIncidentsBulk(
            @Valid @RequestBody BulkIncidentImportRequest request
    ) {
        BulkIncidentImportResult result = incidentService.importIncidentsBulk(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/bulk/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportAllIncidentsCsv() {
        String csv = incidentService.exportAllIncidentsToCsv();
        byte[] bytes = csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"incidents.csv\"")
                .contentType(new MediaType("text", "csv"))
                .contentLength(bytes.length)
                .body(bytes);
    }

}
