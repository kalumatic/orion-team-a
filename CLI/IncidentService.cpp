#include "IncidentService.h"
#include "EmployeeService.h"

#include <cpr/cpr.h>
#include "json.hpp"
#include <iostream>
#include <stdexcept>

using json = nlohmann::json;

IncidentService::IncidentService(const std::string& backendUrl)
    : m_backendUrl(backendUrl),
      m_employeeService()
{
}

bool IncidentService::createAndSendIncident(
    const std::string& reporterEmail,
    const std::string& deviceSerial,
    const std::string& description,
    const std::string& severityStr,
    const std::string& statusStr)
{
    try
    {
        if (reporterEmail.empty() || deviceSerial.empty() || description.empty())
        {
            std::cerr << "One or more required fields are empty.\n";
            return false;
        }

     
        if (!m_employeeService.fetchAllEmployees())
            return false;


        if (!m_employeeService.emailExists(reporterEmail))
        {
            std::cerr << "Employee email not found.\n";
            return false;
        }


        Incident::Severity severity = parseSeverity(severityStr);
        Incident::Status status = parseStatus(statusStr);

        Incident incident(
            reporterEmail,
            deviceSerial,
            description,
            severity,
            status
        );

        // 7️⃣ Send to backend
        return sendIncidentToBackend(incident);
    }
    catch (const std::exception& e)
    {
        std::cerr << "Error: " << e.what() << "\n";
        return false;
    }
}
bool IncidentService::sendIncidentToBackend(const Incident& incident)
{
    // Convert the Incident to JSON
    nlohmann::json jsonData = incident.toJson();

    // Send POST request to backend
    auto response = cpr::Post(
        cpr::Url{ "http://localhost:8080/api/incidents/importIncident" },
        cpr::Header{ {"Content-Type", "application/json"} },
        cpr::Body{ jsonData.dump() }
    );

    // Check response
    if (response.status_code == 200 || response.status_code == 201)
    {
        std::cout << "Incident sent successfully.\n";
        return true;
    }

    std::cerr << "Error sending incident: " << response.status_code << "\n";
    std::cerr << response.text << "\n";
    return false;
}

Incident::Severity IncidentService::parseSeverity(const std::string& str)
{
    if (str == "Low")
        return Incident::Severity::Low;

    if (str == "Medium")
        return Incident::Severity::Medium;

    if (str == "High")
        return Incident::Severity::High;

    if (str == "Critical")
        return Incident::Severity::Critical;

    throw std::invalid_argument("Invalid severity value: " + str);
}

Incident::Status IncidentService::parseStatus(const std::string& str)
{
    if (str == "Open")
        return Incident::Status::Open;

    if (str == "In Progress")
        return Incident::Status::InProgress;

    if (str == "Closed")
        return Incident::Status::Closed;

    throw std::invalid_argument("Invalid status value: " + str);
}