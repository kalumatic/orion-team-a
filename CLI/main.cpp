/* #include "CLI.h"

int main() {
	CLI terminal;
	
	terminal.run();

	return 0;
}*/
#include <iostream>
#include "Employee.h"
#include "EmployeeService.h"
#include "IncidentService.h"
//#include "Device.h"

int main() {
    
        IncidentService service("http://localhost:8080");

        bool success = service.createAndSendIncident(
            "johne@email.com",      // must exist in DB
            "SERIAL123",               // MUST EXIST in DB
            "Test incident from C++",
            "High",
            "Open"
        );

        if (success)
            std::cout << "Incident created successfully.\n";
        else
            std::cout << "Failed to create incident.\n";

        return 0;
    
}