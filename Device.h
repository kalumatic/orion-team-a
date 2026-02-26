#pragma once
#include "EmployeeService.h"

class Device {
	std::string type;
	std::string model;
	std::string serialNumber;
	Employee& employee;
public:
	Device(const std::string& type, const std::string& model, const std::string& serialNumber, Employee& employee);

	std::string getSerialNumber() const;
	Employee getEmployee() const;
	json toJson() const;
};