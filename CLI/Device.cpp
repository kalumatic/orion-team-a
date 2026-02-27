#include "Device.h"
#include <iostream>

using namespace std;

Device::Device(const string& type, const string& model, const string& serialNumber, Employee& employee) : employee(employee) {
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


	return json;
}

string Device::getSerialNumber() const {
	return serialNumber;
}

Employee Device::getEmployee() const {
	return employee;
}