/* #include "CLI.h"

int main() {
	CLI terminal;
	
	terminal.run();

	return 0;
}*/
#include <iostream>
#include "Employee.h"
#include "EmployeeService.h"
//#include "Device.h"

int main() {
    try {
        //Employee emp("Johne", "Doe", "johne@email.com");

        //auto j = emp.toJson();

        EmployeeService eSerivce;

        //bool testCreate = eSerivce.createEmployee(emp);

        //cout << testCreate << "\n";

       // bool testFetch = eSerivce.fetchAllEmployees();

        //cout << !testFetch << "\n";

        eSerivce.printToCSV("test");

       // std::cout << j.dump(4) << std::endl;   
    }
    catch (const std::exception& ex) {
        std::cerr << "Error: " << ex.what() << std::endl;
    }
}