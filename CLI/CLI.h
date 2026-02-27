#pragma once
#include "DeviceService.h"
#include "EmployeeService.h"
#include "IncidentService.h"

class CLI {
	DeviceService& deviceService;
	EmployeeService& employeeService;
	IncidentService& incidentService;
	void showMenu();
	void createIncident();
	void createDevice();
	void createEmployee();
	void storeEnteriesIntoDB();
	void trackNewIncidents();
	void syncEmployeesWithBackend();
public:
	CLI(EmployeeService& employeeService, DeviceService& deviceService, IncidentService& incidentService);
	void run();
};