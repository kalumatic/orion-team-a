import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = 'http://your-api-url/devices';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Device[]> {
    // TODO: implement
    return this.http.get<Device[]>(this.apiUrl);
  }

  getById(id: number): Observable<Device> {
    // TODO: implement
    return this.http.get<Device>(`${this.apiUrl}/${id}`);
  }

  create(device: Partial<Device>): Observable<Device> {
    // TODO: implement
    return this.http.post<Device>(this.apiUrl, device);
  }

  update(id: number, device: Partial<Device>): Observable<Device> {
    // TODO: implement
    return this.http.put<Device>(`${this.apiUrl}/${id}`, device);
  }

  delete(id: number): Observable<void> {
    // TODO: implement
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}