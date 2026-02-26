import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceRequest, DeviceResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = 'http://localhost:8080/api/devices';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DeviceResponse[]> {
    return this.http.get<DeviceResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<DeviceResponse> {
    return this.http.get<DeviceResponse>(`${this.apiUrl}/${id}`);
  }

  create(device: DeviceRequest): Observable<DeviceResponse> {
    return this.http.post<DeviceResponse>(this.apiUrl, device);
  }

  update(id: number, device: DeviceRequest): Observable<DeviceResponse> {
    return this.http.put<DeviceResponse>(`${this.apiUrl}/${id}`, device);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  downloadCsv(): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/bulk/export`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

}