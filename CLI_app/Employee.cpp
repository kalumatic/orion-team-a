#include <fstream>
#include "Employee.h"
#include <regex>
#include <stdexcept>
#include "json.hpp"

using json = nlohmann::json;



Employee::Employee(const std::string& name,const std::string& lastName, const std::string& email)
    {
        if (!isValidName(name))
            throw std::invalid_argument("Invalid first name");

        if (!isValidName(lastName))
            throw std::invalid_argument("Invalid last name");

        if (!isValidEmail(email))
            throw std::invalid_argument("Invalid email address");

        m_name = name;
        m_lastName = lastName;
        m_email = email;
    }


bool Employee::isValidName(const std::string& name) {
    std::regex nameRegex("^[A-Za-z]+$");

    if (!std::regex_match(name, nameRegex))
        return false;
    return true;
}
bool Employee::isValidEmail(const std::string& email) {
    std::regex emailRegex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    if (!std::regex_match(email, emailRegex))
        return false;
    return true;
}


std::string Employee::toJson(const std::string& filename) const
{
    json j = {
        {"name", m_name},
        {"lastName", m_lastName},
        {"emailAddress", m_email}
    };
    std::ofstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open file: " + filename);
    }

    file << j.dump(4);  // pretty print

}