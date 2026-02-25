package com.example.demo.service;

import com.example.demo.dto.IncidentRequestDTO;
import com.example.demo.dto.IncidentResponseDTO;
import com.example.demo.entity.Device;
import com.example.demo.entity.Employee;
import com.example.demo.entity.Incident;
import com.example.demo.exceptions.DatabaseException;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.module.ResolutionException;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService{

    private final IncidentRepository incidentRepository;
    private final EmployeeRepository employeeRepository;
    private final DeviceRepository deviceRepository;


    @Override
    public IncidentResponseDTO createIncident(IncidentRequestDTO req) {
        Employee reporter = employeeRepository.findById(req.getReporterId()).orElseThrow(() -> new ResourceNotFoundException("Employee nije pronadjen"));

        Device device  = deviceRepository.findById(req.getDeviceId()).orElseThrow(()-> new ResourceNotFoundException("Device nije pronadjen"));

        Incident incident = new Incident();
        incident.setDescription(req.getDescription());
        incident.setIncidentDate(req.getIncidentDate());
        incident.setSeverity(req.getSeverity());
        incident.setStatus(req.getStatus());
        incident.setReporter(reporter);
        incident.setDevice(device);

        try{
            Incident saved = incidentRepository.save(incident);
            return mapToResponse(saved);
        }catch (Exception e){
            throw new DatabaseException("Greška prilikom čuvanja incidenta: " + e.getMessage());
        }
    }

    private IncidentResponseDTO mapToResponse(Incident incident) {
        IncidentResponseDTO dto = new IncidentResponseDTO();
        dto.setId(incident.getId());
        dto.setDescription(incident.getDescription());
        dto.setIncidentDate(incident.getIncidentDate());
        dto.setSeverity(incident.getSeverity());
        dto.setStatus(incident.getStatus());

        dto.setReporterId(incident.getReporter().getId());
        dto.setDeviceId(incident.getDevice().getId());

        dto.setReporterName(incident.getReporter().getFirstName() + " " + incident.getReporter().getLastName());

        Device device = incident.getDevice();
        dto.setDeviceInfo(device.getDeviceType() + " " + device.getModel() + " " + device.getSerialNumber());

        return dto;
    }

    @Override
    public List<IncidentResponseDTO> getAllIncidents(String date, String serialNumber, String deviceType) {
        List<Incident> incidents = incidentRepository.findAll();

        if (date != null) {
            LocalDate localDate = LocalDate.parse(date);
            incidents = incidents.stream()
                    .filter(i -> i.getIncidentDate().equals(localDate))
                    .collect(Collectors.toList());
        }

        if (serialNumber != null) {
            incidents = incidents.stream()
                    .filter(i -> i.getDevice().getSerialNumber().equals(serialNumber))
                    .collect(Collectors.toList());
        }

        if (deviceType != null) {
            incidents = incidents.stream()
                    .filter(i -> i.getDevice().getDeviceType().equals(deviceType))
                    .collect(Collectors.toList());
        }

        incidents.sort(Comparator.comparing(Incident::getIncidentDate).reversed());

        return incidents.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public IncidentResponseDTO getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident nije pronađen"));
        return mapToResponse(incident);
    }

    @Override
    public IncidentResponseDTO updateIncident(Long id, IncidentRequestDTO dto) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident sa ID " + id + " nije pronađen"));

        Employee reporter = employeeRepository.findById(dto.getReporterId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee sa ID " + dto.getReporterId() + " nije pronađen"));

        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Device sa ID " + dto.getDeviceId() + " nije pronađen"));

        incident.setDescription(dto.getDescription());
        incident.setIncidentDate(dto.getIncidentDate());
        incident.setSeverity(dto.getSeverity());
        incident.setStatus(dto.getStatus());
        incident.setReporter(reporter);
        incident.setDevice(device);

        try {
            Incident updated = incidentRepository.save(incident);
            return mapToResponse(updated);
        } catch (Exception e) {
            throw new DatabaseException("Greška prilikom update-a incidenta: " + e.getMessage());
        }
    }

    @Override
    public void deleteIncident(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident nije pronađen"));

        incidentRepository.delete(incident);
    }
}
