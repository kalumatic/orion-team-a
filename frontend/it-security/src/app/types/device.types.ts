export interface Device {
  id: number;
  deviceType: string;
  model: string;
  serialNumber: string;
  assignedEmployee: string;
  // assignmentDate: Date;
  // assignedEmployeeId: number;
}

export interface DeviceRequest {
  deviceType: string;
  model: string;
  serialNumber: string;
  assignedEmployeeId: number;
  assignmentDate?: string; // optional, yyyy-MM-dd
}

export interface DeviceResponse {
  id: number;
  deviceType: string;
  model: string;
  serialNumber: string;
  assignedEmployee: number; // this is the ID from backend
  assignedEmployeeName?: string; // populated on frontend after employee cache lookup
  assignmentDate: string;
}