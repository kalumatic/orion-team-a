#include "CLI.h"

int main() {
	CLI terminal;
	
	terminal.run();

	return 0;
}
/*
#include <iostream>
#include "Employee.h"
#include "Device.h"

int main() {
    try {
        Employee emp("John", "Doe", "john@email.com");

        Device dev("Laptop", "", "ABC123", emp);

        auto j = dev.toJson();

        std::cout << j.dump(4) << std::endl; 

    }
    catch (const std::exception& ex) {
        std::cerr << "Error: " << ex.what() << std::endl;
    }
}*/