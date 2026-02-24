#include Employee.h

Employee::Employee(string name, string lastName,string email) {

    if (validateEmployee(name,lastName,email)) {
        m_name = name;
        m_lastName = lastName;
        m_email = email;
        toJson();
    }
}

Employee::validateEmployee(string name, string lastName, string email) {

}