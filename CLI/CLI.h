#pragma once


class CLI {
	void showMenu();
	void createIncident();
	void createDevice();
	void createEmployee();
	void storeEnteriesIntoDB();
	void trackNewIncidents();
	void syncDevicesWithBackend();
public:
	void run();
};