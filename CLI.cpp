#include "CLI.h"
#include <iostream>

using namespace std;

void CLI::run() {
	int selectedOption;

	while (true) {
		showMenu();

		cin >> selectedOption;

		switch (selectedOption) {
		case 0:
			return;
		case 1:
			cout << "Selected option-> 1\n";
			createIncident();//not implemented
			break;

		case 2:
			cout << "Selected option-> 2\n";;
			createDevice();//not implemented
			break;

		case 3:
			cout << "Selected option-> 3\n";
			createEmployee();//not implemented
			break;

		case 4:
			cout << "Selected option-> 4\n";
			storeEnteriesIntoDB();//not implemented
			break;

		case 5:
			cout << "Selected option-> 5\n";
			trackNewIncidents();//not implemented
			break;

		case 6:
			cout << "Selected option-> 6\n";
			syncDevicesWithBackend();//not implemented
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
	cout << "6)Sync Devices with Backend\n";
	cout << "0)Exit\n";
}

void CLI::createIncident(){}
void CLI::createDevice(){}
void CLI::createEmployee(){}
void CLI::storeEnteriesIntoDB(){}
void CLI::trackNewIncidents(){}
void CLI::syncDevicesWithBackend(){}