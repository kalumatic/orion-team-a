/* 

int main() {
	CLI terminal;
	
	terminal.run();

	return 0;
}*/
#include <iostream>
#include "CLI.h"

using namespace std;

int main() {
    try {
        EmployeeService employeeService;
        DeviceService devService(employeeService);
        CLI terminal(employeeService, devService);

        terminal.run();
        //Employee emp("Johne", "Doe", "johne@email.com");

        //auto j = emp.toJson();

       

        //bool testCreate = eSerivce.createEmployee(emp);

       // cout << testCreate << "\n";

       // bool testFetch = eSerivce.fetchAllEmployees();

       // cout << !testFetch << "\n";

        //eSerivce.printToCSV("test");
        
       // std::cout << j.dump(4) << std::endl;   
    }
    catch (const std::exception& ex) {
        std::cerr << "Error: " << ex.what() << std::endl;
    }
}