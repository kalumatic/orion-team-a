#pragma once
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
};