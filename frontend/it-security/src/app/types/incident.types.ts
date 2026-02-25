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

export interface IncidentRequest {
  description: string;
  incidentDate: string;   // LocalDate expects yyyy-MM-dd string
  severity: string;
  status: string;
  reporterId: number;
  deviceId: number;
}

export interface IncidentResponse {
  id: number;
  description: string;
  incidentDate: string;
  severity: string;
  status: string;
  reporterName: string;
  reporterId: number;    // add this
  deviceInfo: string;
  deviceId: number;      // add this
}