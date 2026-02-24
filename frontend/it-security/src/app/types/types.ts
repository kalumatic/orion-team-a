export interface Incident {
  id: number;
  reporter: string;
  description: string;
  serialNumber: string;
  deviceType: string;
  date: Date;
  severity: string;
  status: string;
}

export interface Device {
  id: number;
  deviceType: string;
  model: string;
  serialNumber: string;
  assignedEmployee: string;
}

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}