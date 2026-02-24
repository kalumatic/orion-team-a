package com.example.demo.service;

import com.example.demo.dto.IncidentRequestDTO;
import com.example.demo.dto.IncidentResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface IncidentService {

    IncidentResponseDTO createIncident(IncidentRequestDTO req);

    List<IncidentResponseDTO> getAllIncidents(String date, String serialNumber, String deviceType);

    IncidentResponseDTO getIncidentById(Long id);

    IncidentResponseDTO updateIncident(Long id, IncidentRequestDTO dto);

    void deleteIncident(Long id);
}
