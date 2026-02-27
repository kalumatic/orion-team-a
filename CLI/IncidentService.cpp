#include "IncidentService.h"
#include "EmployeeService.h"

#include <cpr/cpr.h>
#include "json.hpp"
#include <iostream>
#include <stdexcept>
#include <fstream>
using namespace std;

using json = nlohmann::json;

IncidentService::IncidentService(EmployeeService& empolyeeService, DeviceService& deviceServise)
    : m_employeeService(empolyeeService),
    m_deviceService(deviceServise)
{
}

bool IncidentService::createIncident(
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

     
        if (m_employeeService.fetchAndSearchAllEmployes(reporterEmail) <= 0){
            std::cerr << "Employee email not found.\n";
            return false;
        }

        if (!m_deviceService.fetchAndSearchAllDevices(deviceSerial))
            return false;


        //if (!m_employeeService.emailExists(reporterEmail))
        //{
        //    std::cerr << "Employee email not found.\n";
        //    return false;
        //}


        Incident::Severity severity = parseSeverity(severityStr);
        Incident::Status status = parseStatus(statusStr);

        Incident incident(
            reporterEmail,
            deviceSerial,
            description,
            severity,
            status
        );
        m_incidents.push_back(incident);
        return true;

    }
    catch (const std::exception& e)
    {
        std::cerr << "Error: " << e.what() << "\n";
        return false;
    }
}

bool IncidentService::sendIncidentToBackend()
{
    for (auto incident : m_incidents) {
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
    }
    else {
        std::cerr << "Error sending incident: " << response.status_code << "\n";
        std::cerr << response.text << "\n";
        return false;
        }
    }
    m_incidents.clear();

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

void IncidentService::trackIncidents(const string& filename) {
    auto response = cpr::Get(
        cpr::Url{ "http://localhost:8080/api/incidents" },
        cpr::Timeout{ 5000 } 
    );

    if (response.status_code == 200) {
        ofstream file(filename);

        auto now = std::chrono::system_clock::now();
        std::time_t now_time = std::chrono::system_clock::to_time_t(now);
        std::tm tm;
        localtime_s(&tm, &now_time);


        file << "Filename,date and time\n";
        file << filename << ",";
        file << std::put_time(&tm, "%d-%m-%Y %H:%M:%S\n");

        json incidents = json::parse(response.text);

        std::cout << "---- INCIDENTS ----\n";
        file << "ID" << "," << "Date" << "," << "Reporter Employee" << "," << "Employe ID" << "," << "Device" << "," << "Device ID" << "," << "Severity" << "," << "Status" << "," << "Descritption\n";

        for (const auto& incident : incidents) {

            file <<incident["id"]
                << ","<< incident["incidentDate"] << ","
                << incident["reporterName"]
                << "," << incident["reporterId"] << ","
                << incident["deviceInfo"]
                << "," << incident["deviceId"] << ","
                << incident["severity"] << ","
                << incident["status"] << ","
                << incident["description"] << "\n";

            std::cout << "ID: " << incident["id"] << "\n"
                << "Date: " << incident["incidentDate"] << "\n"
                << "Reporter: " << incident["reporterName"]
                << " (ID: " << incident["reporterId"] << ")\n"
                << "Device: " << incident["deviceInfo"]
                << " (ID: " << incident["deviceId"] << ")\n"
                << "Severity: " << incident["severity"] << "\n"
                << "Status: " << incident["status"] << "\n"
                << "Description: " << incident["description"] << "\n"
                << "----------------------------------------\n";
        }

    }
    else {
        std::cout << "Request failed. Status code: "
            << response.status_code << std::endl;
    }
}