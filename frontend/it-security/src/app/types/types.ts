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
  deviceType: string;
  model: string;
  serialNumber: string;
  assignmentDate: Date;
}