#pragma once
#include <iostream>
#include <fstream>
#include "Employee.h"
#include "json.hpp"
#include "Incident.h"
#include <stdexcept>
#include <cpr/cpr.h>

// Constructor
Incident::Incident(const std::string& reporter,
    const std::string& device,
    const std::string& description,
    const std::string& severity,
    const std::string& status)
{
    // Validation calls (implementation will be provided later)
    if (!isValidEmpolyee(reporter))
    {
        throw std::invalid_argument("Invalid employee");
    }

    if (!isValidDevice(device))
    {
        throw std::invalid_argument("Invalid device");
    }
    try {
       auto sev = Incident::parseSeverity(severity);
       m_severity = sev;
    }
    catch (const std::invalid_argument& e) {
        std::cout << "Invalid severity entered: " << e.what() << std::endl;
        // handle error: e.g., ask user to re-enter or exit
    }

    try {
        auto stat = Incident::parseStatus(status);
        m_status = stat;
    }
    catch (const std::invalid_argument& e) {
        std::cout << "Invalid severity entered: " << e.what() << std::endl;
        // handle error: e.g., ask user to re-enter or exit
    }

    m_reporter = reporter;
    m_device = device;
    m_description = description;
    

}

// Getters

const std::string Incident::getEmployee()
{
    return m_reporter;
}

const std::string Incident::getDevice()
{
    return m_device;
}

const std::string Incident::getDescription()
{
    return m_description;
}

const std::chrono::system_clock::time_point Incident::getDate()
{
    return m_date;
}

const Incident::Severity Incident::getSeverity()
{
    return m_severity;
}

const Incident::Status Incident::getStatus()
{
    return m_status;
}

// Validation methods (NOT implemented yet)

bool Incident::isValidEmpolyee(const std::string& e)
{
    // Implementation will be provided later
    return true;
}

bool Incident::isValidDevice(const std::string& d)
{
    // Implementation will be provided later
    return true;
}
Incident::Severity Incident::parseSeverity(const std::string& str)
{
    if (str == "Low") return Severity::Low;
    if (str == "Medium") return Severity::Medium;
    if (str == "High") return Severity::High;
    if (str == "Critical") return Severity::Critical;

    throw std::invalid_argument("Invalid severity: " + str);
}

Incident::Status Incident::parseStatus(const std::string& str) {
    if (str == "Open") return Status::Open;
    if (str == "InProgress") return Status::InProgress;
    if (str == "Closed") return Status::Closed;

    throw std::invalid_argument("Invalid status: " + str);
}

using json = nlohmann::json;

json Incident::toJson() const
{
    json j;

    j["reporterId"] = m_reporter;
    j["device"] = m_device;
    j["description"] = m_description;

    // Convert enums to string (recommended)
    switch (m_severity)
    {
    case Severity::Low:      j["severity"] = "Low"; break;
    case Severity::Medium:   j["severity"] = "Medium"; break;
    case Severity::High:     j["severity"] = "High"; break;
    case Severity::Critical: j["severity"] = "Critical"; break;
    }

    switch (m_status)
    {
    case Status::Open:       j["status"] = "Open"; break;
    case Status::InProgress: j["status"] = "InProgress"; break;
    case Status::Closed:     j["status"] = "Closed"; break;
    }

    // Optional: convert date to timestamp
    j["date"] = std::chrono::duration_cast<std::chrono::seconds>(
        m_date.time_since_epoch()
    ).count();

    return j;
}