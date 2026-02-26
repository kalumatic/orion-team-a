#ifndef ORION_TEAM_A_EMPLOYEE_H
#define ORION_TEAM_A_EMPLOYEE_H


#include <string>
#include <json.hpp>
#include <chrono>
#include <ctime>

using json = nlohmann::json;

class Employee
{
private:
    std::string m_name;
    std::string m_lastName;
    std::string m_email;
public:
    Employee(){}
    Employee(
             const std::string& name,
             const std::string& lastName,
             const std::string& email);

    std::string toJson(const std::string& filename) const;
    json toJson() const;
    std::string getName() const;
   // void setName(const string& name);
    std::string getLastname() const;
    //void setLastname(const string& lastname);
    std::string getEmail() const;
   // void setEmail(const string& email);
    static bool isValidName(const std::string& name);
    static bool isValidEmail(const std::string& email);

};


#endif //ORION_TEAM_A_EMPLOYEE_H