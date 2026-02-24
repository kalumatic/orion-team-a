#pragma once


class CLI {
private:
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