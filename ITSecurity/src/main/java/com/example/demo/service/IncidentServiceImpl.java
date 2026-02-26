package com.example.demo.service;

import com.example.demo.dto.request.AiIncidentGenerateRequest;
import com.example.demo.dto.request.IncidentImportRequest;
import com.example.demo.dto.request.IncidentRequestDTO;
import com.example.demo.dto.response.AiIncidentGenerateResponse;
import com.example.demo.dto.response.IncidentResponseDTO;
import com.example.demo.entity.Device;
import com.example.demo.entity.Employee;
import com.example.demo.entity.Incident;
import com.example.demo.exceptions.DatabaseException;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.ValidationException;
import com.example.demo.repository.DeviceRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService{

    private final IncidentRepository incidentRepository;
    private final EmployeeRepository employeeRepository;
    private final DeviceRepository deviceRepository;
    private final LlamaIncidentClient llamaIncidentClient;

    private static final List<String> ALLOWED_SEVERITY = List.of("Low", "Medium", "High", "Critical");
    private static final List<String> ALLOWED_STATUS = List.of("Open", "In Progress", "Closed");


    @Override
    public IncidentResponseDTO createIncident(IncidentRequestDTO req) {
        validateIncident(req);

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

    @Override
    public IncidentResponseDTO importIncident(IncidentImportRequest dto) {

        Employee reporter = employeeRepository.findByEmail(dto.getEmail()).orElseThrow(() -> new ResourceNotFoundException("Employee nije pronadjen"));

        Device device = deviceRepository.findBySerialNumber(dto.getSerialNumber()).orElseThrow(() -> new ResourceNotFoundException("Device nije pronadjen"));

        Incident incident = new Incident();
        incident.setDescription(dto.getDescription());
        incident.setIncidentDate(dto.getIncidentDate());
        incident.setSeverity(dto.getSeverity());
        incident.setStatus(dto.getStatus());
        incident.setReporter(reporter);
        incident.setDevice(device);

        try{
            Incident saved = incidentRepository.save(incident);
            return mapToResponse(saved);
        }catch (Exception e) {
            throw new DatabaseException("Greška prilikom čuvanja incidenta: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public AiIncidentGenerateResponse generateIncidentsWithAi(AiIncidentGenerateRequest request) {
        LocalDate incidentDate = request.getIncidentDate() != null ? request.getIncidentDate() : LocalDate.now();
        int requestedCount = request.getCount();

        List<Employee> employees = employeeRepository.findAll();
        List<Device> devices = deviceRepository.findAll();
        if (employees.isEmpty()) {
            throw new ValidationException("No employees available for incident generation.");
        }
        if (devices.isEmpty()) {
            throw new ValidationException("No devices available for incident generation.");
        }

        Set<PairKey> usedPairs = new HashSet<>();
        for (Incident existing : incidentRepository.findByIncidentDate(incidentDate)) {
            usedPairs.add(new PairKey(existing.getReporter().getId(), existing.getDevice().getId()));
        }

        List<PairCandidate> availablePairs = new ArrayList<>();
        for (Employee employee : employees) {
            for (Device device : devices) {
                PairKey key = new PairKey(employee.getId(), device.getId());
                if (!usedPairs.contains(key)) {
                    availablePairs.add(new PairCandidate(employee, device));
                }
            }
        }
        Collections.shuffle(availablePairs);

        int maxCreatable = availablePairs.size();
        int targetCount = Math.min(requestedCount, maxCreatable);

        List<String> warnings = new ArrayList<>();
        if (targetCount < requestedCount) {
            warnings.add("Only " + targetCount + " incidents can be created because unique reporter/device pairs for this date are exhausted.");
        }

        if (targetCount == 0) {
            return AiIncidentGenerateResponse.builder()
                    .requestedCount(requestedCount)
                    .savedCount(0)
                    .skippedCount(requestedCount)
                    .aiGeneratedCount(0)
                    .fallbackCount(0)
                    .warnings(warnings)
                    .savedIds(List.of())
                    .build();
        }

        List<LlamaIncidentClient.IncidentDraft> drafts = llamaIncidentClient.generateDrafts(targetCount);
        int plannedFallbackCount = Math.max(0, targetCount - drafts.size());
        if (plannedFallbackCount > 0) {
            warnings.add("AI returned fewer incident drafts than requested. Fallback content was used for " + plannedFallbackCount + " incident(s).");
        }

        List<Long> savedIds = new ArrayList<>();
        int aiGeneratedCount = 0;
        int fallbackCount = 0;
        for (int i = 0; i < targetCount; i++) {
            PairCandidate pair = availablePairs.get(i);
            boolean usedFallback = i >= drafts.size();
            LlamaIncidentClient.IncidentDraft draft = usedFallback ? fallbackDraft(i) : drafts.get(i);

            Incident incident = new Incident();
            incident.setDescription(draft.description());
            incident.setSeverity(draft.severity());
            incident.setStatus(draft.status());
            incident.setIncidentDate(incidentDate);
            incident.setReporter(pair.employee());
            incident.setDevice(pair.device());

            if (incidentRepository.existsByReporterIdAndDeviceIdAndIncidentDate(
                    pair.employee().getId(),
                    pair.device().getId(),
                    incidentDate
            )) {
                warnings.add("Skipped duplicate reporter/device/date pair: reporterId=" + pair.employee().getId()
                        + ", deviceId=" + pair.device().getId());
                continue;
            }

            try {
                Incident saved = incidentRepository.save(incident);
                savedIds.add(saved.getId());
                if (usedFallback) {
                    fallbackCount++;
                } else {
                    aiGeneratedCount++;
                }
            } catch (Exception ex) {
                warnings.add("Failed to save generated incident for reporterId=" + pair.employee().getId()
                        + ", deviceId=" + pair.device().getId());
            }
        }

        return AiIncidentGenerateResponse.builder()
                .requestedCount(requestedCount)
                .savedCount(savedIds.size())
                .skippedCount(requestedCount - savedIds.size())
                .aiGeneratedCount(aiGeneratedCount)
                .fallbackCount(fallbackCount)
                .savedIds(savedIds)
                .warnings(warnings)
                .build();
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

    private void validateIncident(IncidentRequestDTO dto) {
        if (!ALLOWED_SEVERITY.contains(dto.getSeverity())) {
            throw new ValidationException("Nevažeća vrednost severity: " + dto.getSeverity());
        }
        if (!ALLOWED_STATUS.contains(dto.getStatus())) {
            throw new ValidationException("Nevažeća vrednost status: " + dto.getStatus());
        }
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
        validateIncident(dto);

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

    private LlamaIncidentClient.IncidentDraft fallbackDraft(int index) {
        String[] severities = {"Low", "Medium", "High", "Critical"};
        String[] statuses = {"Open", "In Progress", "Closed"};
        String severity = severities[index % severities.length];
        String status = statuses[index % statuses.length];
        return new LlamaIncidentClient.IncidentDraft(
                "AI generated security incident #" + (index + 1),
                severity,
                status
        );
    }

    private record PairKey(Long reporterId, Long deviceId) {
    }

    private record PairCandidate(Employee employee, Device device) {
    }
}
