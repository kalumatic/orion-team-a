
#include "DeviceService.h"
#include <iostream>

using namespace std;

DeviceService::DeviceService(EmployeeService& employeeService) :employeeService(employeeService) {}

bool DeviceService::createDevice(Device& device) {
    long employeeId = employeeService.fetchAndSearchAllEmployes(device.getEmployee().getEmail());
    if (employeeId <= 0) {
        std::cerr << "Employee does not exist\n";
        return false;
    }

    // nlohmann::json jsonData = device.toJson();
    nlohmann::json jsonData;
    jsonData["deviceType"] = device.getType();
    jsonData["model"] = device.getModel();
    jsonData["serialNumber"] = device.getSerialNumber();
    jsonData["assignedEmployeeId"] = employeeId;

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

    //cout << jsonData.dump();
    for (const auto& item : jsonData) {
 
        long employeeId = item.at("assignedEmployee");
        Employee employee = employeeService.getEmployee(employeeId);
        Device device(
            item.at("deviceType").get<std::string>(),
            item.at("model").get<std::string>(),
            item.at("serialNumber").get<std::string>(),
            employee
        );
        if (serialNumber == device.getSerialNumber()) {
            cout << "Found device\n";
            return true;
        }
        allDevices.push_back(device);
    }

    return false;
}
