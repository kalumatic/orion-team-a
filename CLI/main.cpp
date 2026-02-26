#include <iostream>
#include "Employee.h"
#include "EmployeeService.h"
#include "IncidentService.h"

int main() {

    IncidentService service("http://localhost:8080");

    bool success = service.createIncident(
        "dimi@gmail.com",
        "12345",              
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