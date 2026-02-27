#include <iostream>
#include "Employee.h"
#include "EmployeeService.h"
#include "IncidentService.h"
#include "CLI.h"

int main() {
    EmployeeService emService;
    DeviceService dService(emService);
    IncidentService service(emService, dService);

    CLI terminal(emService, dService, service);
    terminal.run();
    return 0;

}