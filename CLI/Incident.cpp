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
    const Severity& severity,
    const Status& status)
{

    m_reporter = reporter;
    m_device = device;
    m_description = description;
    m_severity = severity;
    m_status = status;
    m_date = std::chrono::system_clock::now();
    
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


using json = nlohmann::json;

nlohmann::json Incident::toJson() const
{
    nlohmann::json j;

    j["email"] = m_reporter;
    j["serialNumber"] = m_device;
    j["description"] = m_description;

   
    std::time_t tt = std::chrono::system_clock::to_time_t(m_date);

    std::tm tm{};
    localtime_s(&tm, &tt);

    std::ostringstream oss;
    oss << std::put_time(&tm, "%Y-%m-%d");
    j["incidentDate"] = oss.str();

    switch (m_severity)
    {
    case Severity::Low: j["severity"] = "Low"; break;
    case Severity::Medium: j["severity"] = "Medium"; break;
    case Severity::High: j["severity"] = "High"; break;
    case Severity::Critical: j["severity"] = "Critical"; break;
    }

    switch (m_status)
    {
    case Status::Open: j["status"] = "Open"; break;
    case Status::InProgress: j["status"] = "In Progress"; break;
    case Status::Closed: j["status"] = "Closed"; break;
    }

    return j;
}