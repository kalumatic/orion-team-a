#pragma once


#include <string>

class Employee
{
private:
    std::string m_name;
    std::string m_lastName;
    std::string m_email;

public:
    Employee() = default;
    Employee(const std::string& name,
             const std::string& lastName,
             const std::string& email);

   

    std::string toJson(const std::string& filename) const;
    

private:
    static bool isValidName(const std::string& name);
    static bool isValidEmail(const std::string& email);
};
