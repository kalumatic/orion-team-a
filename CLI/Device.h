#pragma once
<<<<<<< HEAD
#include "EmployeeService.h"

class Device {
	std::string type;
	std::string model;
	std::string serialNumber;
	Employee& employee;
public:
	Device(const std::string& type, const std::string& model, const std::string& serialNumber, Employee& employee);

	std::string getSerialNumber() const;
	std::string getType() const;
	std::string getModel() const;
	Employee getEmployee() const;
	json toJson() const;
=======
#include "Employee.h"
//#include "json.hpp"

//using json = nlohmann::json; 

using namespace std;

class Device {
	string type;
	string model;
	string serialNumber;
	Employee& employee;

public:
	Device(const string& type, const string& model, const string& serialNumber, Employee& employee);

	json toJson() const;
	/*static bool isTypeValid(const string& type);
	static bool isModelValid(const string& model);
	static bool isSerialNumberValid(const string& serialNumber);
	static bool isEmployeeValid(Employee* employee);*/

	//~Device();
>>>>>>> feature/cli-mergingBranch
};