#pragma once
#include "Employee.h"
#include <cpr/cpr.h>


class EmployeeService {	
	std::vector<Employee> allEmployees;

public:
	EmployeeService() {};
	bool fetchAllEmployees();
	bool fetchAndSearchAllEmployes(const std::string& email);
	bool createEmployee(Employee& employee);
	void printToCSV(const std::string& filename) const;
};