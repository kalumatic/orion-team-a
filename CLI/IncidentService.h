#pragma once

#include "Incident.h"
#include <vector>
#include <string>
#include "EmployeeService.h"
#include "DeviceService.h"

class IncidentService
{
public:
    IncidentService(EmployeeService& empolyeeService, DeviceService& deviceServise);

    // Tries to create and send an incident
    bool createIncident(const std::string& reporter,
        const std::string& device,
        const std::string& description,
        const std::string& severityStr,
        const std::string& status);

    bool sendIncidentToBackend();
    void trackIncidents();
private:
    std::string m_backendUrl;
    EmployeeService& m_employeeService;
    DeviceService& m_deviceService;

    // Helper: validate device & employee
    bool validateInput(const std::string& reporter, const std::string& device,
        const std::string& description);

    // Helper: send Incident to backend
    

    static Incident::Severity parseSeverity(const std::string& str);
    static Incident::Status parseStatus(const std::string& str);

public:
    std::vector <Incident> m_incidents;
};