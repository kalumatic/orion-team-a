#pragma once
#include "DeviceService.h"
#include "EmployeeService.h"

class CLI {
	DeviceService& deviceService;
	EmployeeService& employeeService;
	void showMenu();
	void createIncident();
	void createDevice();
	void createEmployee();
	void storeEnteriesIntoDB();
	void trackNewIncidents();
	void syncEmployeesWithBackend();
public:
	CLI(EmployeeService& employeeService, DeviceService& deviceService);
	void run();
};