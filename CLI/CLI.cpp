#include "CLI.h"
#include <iostream>
#include "Employee.h"

using namespace std;

CLI::CLI(EmployeeService& employeeService, DeviceService& deviceService, IncidentService& incidentService)
	: employeeService(employeeService),
	deviceService(deviceService),
	incidentService(incidentService){}


void CLI::run() {
	int selectedOption;

	while (true) {
		showMenu();

		cin >> selectedOption;

		switch (selectedOption) {
		case 0:
			return;
		case 1:
			createIncident();//not implemented
			break;

		case 2:
			
			createDevice();
			break;

		case 3:
			createEmployee();
			break;

		case 4:
			storeEnteriesIntoDB();//not implemented
			break;

		case 5:
		
			trackNewIncidents();//not implemented
			break;

		case 6:
			syncEmployeesWithBackend();//not implemented
			break;

		default:
			cout << "Invalid option\n";
			cout << "Choose again\n";
			break;
		}
	}
}

void CLI::showMenu() {
	cout << "\n---------------------------------------------------------\n";
	cout << "APPLICATION MENU\n";
	cout << "1)Create Incident\n";
	cout << "2)Create Device\n";
	cout << "3)Create Employee\n";
	cout << "4)Store Enteries in DB\n";
	cout << "5)Track New Incidents\n";
	cout << "6)Sync Employees with Backend\n";
	cout << "0)Exit\n";
}

void CLI::createIncident() {

	string mail;
	string serialNumber;
	string description;
	string status;
	string severity;

	cout << "Enter employee mail\n";
	getline(cin, mail);
	getline(cin, mail);
	while (!Employee::isValidEmail(mail)) {
		if (mail == "0") return;
		cout << "Employee mail is mandatory - Enter employee email\n";
		getline(cin, mail);
	}

	cout << "Enter Device serial number\n";
	getline(cin, serialNumber);
	while (serialNumber.empty()) {
		if (serialNumber == "0") return;
		cout << "Device serialNumber is mandatory - Enter device serialNumber\n";
		getline(cin, serialNumber);
	}

	cout << "Enter incident description\n";
	getline(cin, description);
	while (description.empty()) {
		if (description == "0") return;
		cout << "Incident description is mandatory - Enter incident description\n";
		getline(cin, description);
	}

	cout << "Enter incident status: Open|Closed|In Progress\n";
	getline(cin, status);
	while (status.empty()) {
		if (status == "0") return;
		cout << "Incident status is mandatory - Enter incident status\n";
		getline(cin, status);
	}

	cout << "Enter incident severity: Low|Medium|High|Critical\n";
	getline(cin, severity);
	while (severity.empty()) {
		if (severity == "0") return;
		cout << "Incident status is severity - Enter incident severity\n";
		getline(cin, severity);
	}

	incidentService.createIncident(mail, serialNumber, description, severity, status);


}

void CLI::createDevice() {
	string type;
	string model;
	string serialNumber;
	string mail;

	cout << "Enter Device type\n";
	getline(cin, type);//for reading leftover input from Menu
	getline(cin, type);
	while (type.empty()) {
		if (type == "0") return;
		cout << "Device type is mandatory - Enter device type\n";
		getline(cin, type);
	}

	cout << "Enter Device model\n";
	getline(cin, model);
	while (model.empty()) {
		if (model == "0") return;
		cout << "Device model is mandatory - Enter device model\n";
		getline(cin, model);
	}

	cout << "Enter Device serial number\n";
	getline(cin, serialNumber);
	while (serialNumber.empty()) {
		if (serialNumber == "0") return;
		cout << "Device serialNumber is mandatory - Enter device serialNumber\n";
		getline(cin, serialNumber);
	}

	cout << "Enter employee mail\n";
	getline(cin, mail);
	while (!Employee::isValidEmail(mail)) {
		if (mail == "0") return;
		cout << "Employee mail is mandatory - Enter employee email\n";
		getline(cin, mail);
	}

	long id = employeeService.fetchAndSearchAllEmployes(mail);
	cout << id;
	if (id <= 0) {
		cout << "Employee doesn't exist - Go to menu and create employee\n";
		return;
	}

	Employee employee = employeeService.getEmployee(id);

	Device device(type, model, serialNumber, employee);

	deviceService.createDevice(device);

}
void CLI::createEmployee() {
	string name;
	string lastname;
	string mail;

	cout << "Enter Employee name\n";
	getline(cin, name);//for reading leftover input from Menu
	getline(cin, name);
	while (!Employee::isValidName(name) || name == "0") {
		cout << "Invalid Employee name - Enter valid name";
		getline(cin, name);
	}
	if (name == "0") return;

	cout << "Enter Employee lastname\n";
	getline(cin, lastname);
	while (!Employee::isValidName(lastname) || lastname == "0") {
		cout << "Invalid Employee lastname - Enter valid lastname";
		getline(cin, lastname);
	}
	if (lastname == "0") return;

	cout << "Enter Employee mail\n";
	getline(cin, mail);
	while (!Employee::isValidEmail(mail) || mail == "0") {
		cout << "Invalid Employee name - Enter valid name";
		getline(cin, mail);
	}
	if (mail == "0") return;

	Employee employee(name, lastname, mail);
	employeeService.createEmployee(employee);
}
void CLI::storeEnteriesIntoDB() {

	incidentService.sendIncidentToBackend();
}
void CLI::trackNewIncidents() {}
void CLI::syncEmployeesWithBackend() {
	string filename;

	cout << "Enter file name\n";
	getline(cin, filename);//for reading leftover input from Menu
	getline(cin, filename);

	employeeService.printToCSV(filename);
}