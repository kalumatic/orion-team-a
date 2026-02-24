#include <fstream>
#include "Employee.h"
#include <regex>
#include <stdexcept>
#include "json/json.h"

Employee::Employee(string name, string lastName,string email)
    {
        if (!isValidName(name))
            throw std::invalid_argument("Invalid first name");

        if (!isValidName(lastName))
            throw std::invalid_argument("Invalid last name");

        if (!isValidEmail(emailAddress))
            throw std::invalid_argument("Invalid email address");

        m_name(name);
        m_lastName(lastName);
        m_emailAddress(emailAddress);
    }


static bool isValidName(const std::string& name) {
    std::regex nameRegex("^[A-Za-z]+$");

    if (!std::regex_match(name, nameRegex))
        return false;
}
static bool isValidEmail(const std::string& email) {
    std::regex emailRegex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    if (!std::regex_match(emailAddress, emailRegex))
        return false;
}

std::string Employee::toJson() const
{
    json j = {
        {"name", m_name},
        {"lastName", m_lastName},
        {"emailAddress", m_emailAddress}
    };
    std::ofstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open file: " + filename);
    }

    file << j.dump(4);  // pretty print

}