//
// Created by pemagenh on 2/24/2026.
//

#ifndef ORION_TEAM_A_EMPLOYEE_H
#define ORION_TEAM_A_EMPLOYEE_H

class Employee {
    std::string m_name;
    std::string m_lastName;
    std::sting m_emailAddress;

    public:
    Employee(string name, string lastName, sting emailAddress);
    ~Employee();

    bool verifyEmployee(string name, string lastName, string emailAddress);
    void toJson();
}


#endif //ORION_TEAM_A_EMPLOYEE_H