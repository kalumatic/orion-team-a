package com.example.demo.service;

import com.example.demo.dto.request.AiIncidentGenerateRequest;
import com.example.demo.dto.request.IncidentImportRequest;
import com.example.demo.dto.request.IncidentRequestDTO;
import com.example.demo.dto.response.AiIncidentGenerateResponse;
import com.example.demo.dto.request.BulkIncidentImportRequest;
import com.example.demo.dto.request.IncidentImportRequest;
import com.example.demo.dto.request.IncidentRequestDTO;
import com.example.demo.dto.response.BulkIncidentImportResult;
import com.example.demo.dto.response.IncidentResponseDTO;

import java.util.List;

public interface IncidentService {

    IncidentResponseDTO createIncident(IncidentRequestDTO req);

    IncidentResponseDTO importIncident(IncidentImportRequest dto);

    AiIncidentGenerateResponse generateIncidentsWithAi(AiIncidentGenerateRequest request);

    List<IncidentResponseDTO> getAllIncidents(String date, String serialNumber, String deviceType);

    IncidentResponseDTO getIncidentById(Long id);

    IncidentResponseDTO updateIncident(Long id, IncidentRequestDTO dto);

    void deleteIncident(Long id);

    BulkIncidentImportResult importIncidentsBulk(BulkIncidentImportRequest request);

    String exportAllIncidentsToCsv();
}
