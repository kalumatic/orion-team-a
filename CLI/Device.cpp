#include "Device.h"
#include <iostream>

<<<<<<< HEAD
using namespace std;

Device::Device(const string& type, const string& model, const string& serialNumber, Employee& employee): employee(employee){
=======


Device::Device(const string& type, const string& model, const string& serialNumber, Employee& employee):employee(employee){
>>>>>>> feature/cli-mergingBranch
	if (type.empty()) {
		cout << "Device type is mandatory - Enter device type\n";
		throw std::invalid_argument("Invalid device type");
	}

	if (model.empty()) {
		cout << "Device model is mandatory - Enter device model\n";
		throw std::invalid_argument("Invalid device model");
	}

	if (serialNumber.empty()) {
		cout << "Device serialNumber is mandatory - Enter device serialNumber\n";
		throw std::invalid_argument("Invalid device serialNumber");
	}

	this->type = type;
	this->model = model;
	this->serialNumber = serialNumber;
}

<<<<<<< HEAD


string Device::getType() const {
	return this->type;
}

string Device::getModel() const {
	return this->model;
}


json Device::toJson() const {
	json json;

	json["deviceType"] = this->type;
	json["model"] = this->model;
	json["serialNumber"] = this->serialNumber;
	json["assignedEmployee"] = this->employee.toJson();
=======
json Device::toJson() const {
	json json;

	json["type"] = type;
	json["model"] = model;
	json["serialNumber"] = serialNumber;
	json["employee"] = employee.toJson();
>>>>>>> feature/cli-mergingBranch
	

	return json;
}

<<<<<<< HEAD
string Device::getSerialNumber() const {
	return serialNumber;
}

Employee Device::getEmployee() const {
	return employee;
}
=======
/*bool Device::isTypeValid(const string& type) {
	if (type.empty()) {
		cout << "Device type is mandatory - Enter device type\n";
		return false;
	}

	return true;
}


bool Device::isModelValid(const string& model) {
	if (model.empty()) {
		cout << "Device model is mandatory - Enter device model\n";
		return false;
	}

	return true;
}


bool Device::isSerialNumberValid(const string& serialNumber) {
	if (serialNumber.empty()) {
		cout << "Device serial number is mandatory - Enter serial number type\n";
		return false;
	}

	return true;
}


bool Device::isEmployeeValid(Employee* employee) {
	if (employee == nullptr) {
		cout << "Employee assigned to device is mandatory - Enter employee first\n";
		return false;
	}

	return true;
}*/

//Device::~Device() {}
>>>>>>> feature/cli-mergingBranch
