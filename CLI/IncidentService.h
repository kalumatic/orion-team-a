#pragma once

#include "Incident.h"
#include <vector>
#include <string>
#include "EmployeeService.h"

class IncidentService
{
public:
    IncidentService(const std::string& backendUrl);

    // Tries to create and send an incident
    bool createIncident(const std::string& reporter,
        const std::string& device,
        const std::string& description,
        const std::string& severityStr,
        const std::string& status);

    bool sendIncidentToBackend(const Incident& incident);
private:
    std::string m_backendUrl;
    EmployeeService m_employeeService;

    // Helper: validate device & employee
    bool validateInput(const std::string& reporter, const std::string& device,
        const std::string& description);

    // Helper: send Incident to backend
    

    static Incident::Severity parseSeverity(const std::string& str);
    static Incident::Status parseStatus(const std::string& str);

public:
    std::vector <Incident> m_incidents;
};