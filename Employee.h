#ifndef ORION_TEAM_A_EMPLOYEE_H
#define ORION_TEAM_A_EMPLOYEE_H


#include <string>
#include <json.hpp>

using json = nlohmann::json;

class Employee
{
private:
    std::string m_name;
    std::string m_lastName;
    std::string m_email;

public:
    Employee(const std::string& name,
             const std::string& lastName,
             const std::string& email);

    std::string toJson(const std::string& filename) const;
    json toJson() const;

private:
    static bool isValidName(const std::string& name);
    static bool isValidEmail(const std::string& email);

};


#endif //ORION_TEAM_A_EMPLOYEE_H