#include "DeviceService.h"
#include <iostream>

using namespace std;

DeviceService::DeviceService(EmployeeService& employeeService) :employeeService(employeeService) {}

bool DeviceService::createDevice(Device& device) {
    if (!employeeService.fetchAndSearchAllEmployes(device.getEmployee().getEmail())) {
        std::cerr << "Employee does not exist\n";
        return false;
    }

    nlohmann::json jsonData = device.toJson();

    auto response = cpr::Post(
        cpr::Url{ "http://localhost:8080/api/devices" },
        cpr::Header{ {"Content-Type", "application/json"} },
        cpr::Body{ jsonData.dump() }
    );

    if (response.status_code == 200 || response.status_code == 201) {
        return true;
    }

    cerr << "Error: " << response.status_code << "\n";
    cerr << response.text << "\n";
    return false;
}

bool DeviceService::fetchAndSearchAllDevices(const string serialNumber) {
    allDevices.clear();
    
    auto response = cpr::Get(
        cpr::Url{ "http://localhost:8080/api/devices/all" }
    );

    if (response.status_code != 200) {
        std::cerr << "Error: " << response.status_code << "\n";
        return false;
    }

    auto jsonData = nlohmann::json::parse(response.text);

    for (const auto& item : jsonData) {
        Employee employee(
            item.at("firstName").get<std::string>(),
            item.at("lastName").get<std::string>(),
            item.at("email").get<std::string>()
        );
        Device device(
            item.at("deviceType").get<std::string>(),
            item.at("model").get<std::string>(),
            item.at("serialNumber").get<std::string>(),
            employee
        );
        if (serialNumber == device.getSerialNumber()) {
            return true;
        }
        allDevices.push_back(device);
    }

    return false;
}