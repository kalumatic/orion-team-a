#include "EmployeeService.h"
#include <fstream>
#include <cpr/cpr.h>
#include <iostream>
#include "json.hpp"




bool EmployeeService::fetchAllEmployees(){
    allEmployees.clear();

    auto response = cpr::Get(
        cpr::Url{ "http://localhost:8080/api/employees/all" }
    );

    if (response.status_code != 200) {
        std::cerr << "Error: " << response.status_code << "\n";
        return false;
    }

    auto jsonData = nlohmann::json::parse(response.text);

   for (const auto& item : jsonData) {
        Employee emp(
            item.at("firstName").get<std::string>(),
            item.at("lastName").get<std::string>(),
            item.at("email").get<std::string>()
        );

        allEmployees.push_back(emp);
    }

    return true;
}


bool EmployeeService::createEmployee(const Employee& employee){
    nlohmann::json jsonData = employee.toJson();

    auto response = cpr::Post(
        cpr::Url{ "http://localhost:8080/api/employees" },
        cpr::Header{ {"Content-Type", "application/json"} },
        cpr::Body{ jsonData.dump() }
    );

    if (response.status_code == 200 || response.status_code == 201) {
        return true;
    }

    std::cerr << "Error: " << response.status_code << "\n";
    std::cerr << response.text << "\n";
    return false;
}

bool EmployeeService::emailExists(const std::string& email)
{

    for (const auto& emp : allEmployees)
    {
        if (emp.getEmail() == email)
            return true;
    }

    return false;
}



//OCEKUJE SE DATE I TIME POZIVA KOMANDE
void EmployeeService::printToCSV(const string& filename) const {
	ofstream file(filename);

    auto now = std::chrono::system_clock::now();
    std::time_t now_time = std::chrono::system_clock::to_time_t(now);
    std::tm tm;
    localtime_s(&tm, &now_time);


    file << "Filename,date and time\n";
    file << filename << ",";
    file << std::put_time(&tm, "%d-%m-%Y %H:%M:%S");
    
}