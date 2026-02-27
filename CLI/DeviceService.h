#pragma once
#include "Device.h"
#include <cpr/cpr.h>
#include "EmployeeService.h"

class DeviceService {
	std::vector<Device> allDevices;
	EmployeeService& employeeService;
public:
	DeviceService(EmployeeService& employeeService);
	bool fetchAndSearchAllDevices(const std::string serialNumber);
	bool createDevice(Device& device);
};
