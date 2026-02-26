export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface EmployeeResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}