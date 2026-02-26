#pragma once
#include "Employee.h"
#include <cpr/cpr.h>


using namespace std;

class EmployeeService {	
	vector<Employee> allEmployees;

public:
	EmployeeService() {};
	bool fetchAllEmployees();
	bool createEmployee(Employee& employee);
	void printToCSV(const string& filename) const;
};