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

    Incident(const std::string& reporter,
        const std::string& device,
        const std::string& description,
        const std::string& severity,
        const std::string& status);

    const std::string getEmployee();
    const std::string getDevice();
    const std::string getDescription();
    const std::chrono::system_clock::time_point getDate();
    const Severity getSeverity();
    const Status getStatus();

private:
    static bool isValidEmpolyee(const std::string& e);
    static bool isValidDevice(const std::string& d);
    static Severity parseSeverity(const std::string& str);
    static Status parseStatus(const std::string& str);

private:
    std::string m_reporter;
    std::string m_device;
    std::string m_description;
    std::chrono::system_clock::time_point m_date;
    Severity m_severity;
    Status m_status;
};