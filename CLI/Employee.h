<<<<<<< HEAD
#ifndef ORION_TEAM_A_EMPLOYEE_H
#define ORION_TEAM_A_EMPLOYEE_H


#include <string>
#include <json.hpp>
=======
#pragma once


#include <string>
#include "json.hpp"
>>>>>>> feature/cli-mergingBranch
#include <chrono>
#include <ctime>

using json = nlohmann::json;

class Employee
{
private:
<<<<<<< HEAD
=======
    
>>>>>>> feature/cli-mergingBranch
    std::string m_name;
    std::string m_lastName;
    std::string m_email;
public:
<<<<<<< HEAD
    Employee(){}
    Employee(
             const std::string& name,
             const std::string& lastName,
             const std::string& email);

=======
    Employee() = default;
    Employee(const std::string& name,
             const std::string& lastName,
             const std::string& email);

   

>>>>>>> feature/cli-mergingBranch
    std::string toJson(const std::string& filename) const;
    json toJson() const;
    std::string getName() const;
   // void setName(const string& name);
    std::string getLastname() const;
    //void setLastname(const string& lastname);
    std::string getEmail() const;
   // void setEmail(const string& email);
<<<<<<< HEAD
=======
private:
>>>>>>> feature/cli-mergingBranch
    static bool isValidName(const std::string& name);
    static bool isValidEmail(const std::string& email);

};
<<<<<<< HEAD


#endif //ORION_TEAM_A_EMPLOYEE_H
=======
>>>>>>> feature/cli-mergingBranch
