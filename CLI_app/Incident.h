#pragma once
#pragma once

#include <string>
#include <chrono>
#include "Employee.h"

class Incident
{
public:
    enum class Severity
    {
        Low,
        Medium,
        High,
        Critical
    };

    enum class Status
    {
        Open,
        InProgress,
        Closed
    };

    Incident(const Employee& reporter,
        const std::string& device,
        const std::string& description,
        Severity severity);

    const Employee getEmployee();
    const std::string getDevice();
    const std::string getDescription();
    const std::chrono::system_clock::time_point getDate();
    const Severity getSeverity();
    const Status getStatus();

private:
    static bool isValidEmpolyee(const Employee e);
    static bool isValidDevice();

private:
    Employee m_reporter;
    std::string m_device;
    std::string m_description;
    std::chrono::system_clock::time_point m_date;
    Severity m_severity;
    Status m_status;
};