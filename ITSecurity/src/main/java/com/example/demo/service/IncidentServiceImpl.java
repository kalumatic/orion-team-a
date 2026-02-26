package com.example.demo.service;

import com.example.demo.dto.request.BulkIncidentImportRequest;
import com.example.demo.dto.request.IncidentImportRequest;
import com.example.demo.dto.request.IncidentRequestDTO;
import com.example.demo.dto.response.BulkIncidentImportResult;
import com.example.demo.dto.response.FailedIncidentRecord;
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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService{

    private final IncidentRepository incidentRepository;
    private final EmployeeRepository employeeRepository;
    private final DeviceRepository deviceRepository;

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

    @Override
    public BulkIncidentImportResult importIncidentsBulk(BulkIncidentImportRequest request) {
        List<Long> successfulIds = new ArrayList<>();
        List<FailedIncidentRecord> failedRecords = new ArrayList<>();

        for (BulkIncidentImportRequest.IncidentImportItem item : request.getIncidents()) {

            String mandatoryError = validateMandatoryFields(item);
            if (mandatoryError != null) {
                addFailed(failedRecords, item, mandatoryError);
                continue;
            }

            if (!ALLOWED_SEVERITY.contains(item.getSeverity())) {
                addFailed(failedRecords, item, "Invalid severity: " + item.getSeverity());
                continue;
            }
            if (!ALLOWED_STATUS.contains(item.getStatus())) {
                addFailed(failedRecords, item, "Invalid status: " + item.getStatus());
                continue;
            }

            Employee reporter = employeeRepository.findByEmail(item.getReporterEmail()).orElse(null);
            if (reporter == null) {
                addFailed(failedRecords, item, "Reporter not found: " + item.getReporterEmail());
                continue;
            }

            Device device = deviceRepository.findBySerialNumber(item.getDeviceSerialNumber()).orElse(null);
            if (device == null) {
                addFailed(failedRecords, item, "Device not found: " + item.getDeviceSerialNumber());
                continue;
            }

            try {
                Incident incident = new Incident();
                incident.setDescription(item.getDescription());
                incident.setIncidentDate(item.getIncidentDate());
                incident.setSeverity(item.getSeverity());
                incident.setStatus(item.getStatus());
                incident.setReporter(reporter);
                incident.setDevice(device);

                Incident saved = incidentRepository.save(incident);
                successfulIds.add(saved.getId());

            } catch (Exception e) {
                addFailed(failedRecords, item, "Database error: " + e.getMessage());
            }
        }

        return new BulkIncidentImportResult(successfulIds, failedRecords);
    }






    @Override
    public String exportAllIncidentsToCsv() {
        List<IncidentResponseDTO> incidents = getAllIncidents(null, null, null);

        incidents.sort(Comparator.comparing(IncidentResponseDTO::getId));

        StringBuilder csv = new StringBuilder();
        csv.append("id,description,incident_Date,severity,status,device_Id,reported_Id\n");

        for (IncidentResponseDTO dto : incidents) {
            csv.append(dto.getId()).append(",")
                    .append(dto.getDescription()).append(",")
                    .append(dto.getIncidentDate()).append(",")
                    .append(dto.getSeverity()).append(",")
                    .append(dto.getStatus()).append(",")
                    .append(dto.getDeviceId()).append(",")
                    .append(dto.getReporterId()).append(",")
                    .append("\n");
        }

        return csv.toString();
    }






    private void addFailed(List<FailedIncidentRecord> failedRecords,
                           BulkIncidentImportRequest.IncidentImportItem item,
                           String errorMessage) {
        failedRecords.add(new FailedIncidentRecord(
                item.getDescription(),
                item.getIncidentDate(),
                item.getSeverity(),
                item.getStatus(),
                item.getReporterEmail(),
                item.getDeviceSerialNumber(),
                errorMessage
        ));
    }
    private String validateMandatoryFields(BulkIncidentImportRequest.IncidentImportItem item) {
        if (item.getDescription() == null || item.getDescription().isBlank()) return "Description is required";
        if (item.getIncidentDate() == null) return "Incident date is required";
        if (item.getSeverity() == null || item.getSeverity().isBlank()) return "Severity is required";
        if (item.getStatus() == null || item.getStatus().isBlank()) return "Status is required";
        if (item.getReporterEmail() == null || item.getReporterEmail().isBlank()) return "Reporter email is required";
        if (item.getDeviceSerialNumber() == null || item.getDeviceSerialNumber().isBlank()) return "Device serial number is required";
        return null;
    }

}
