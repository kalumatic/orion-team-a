import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeRequest, EmployeeResponse } from '../types';
import { Page } from '../types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://your-api-url/api/employees';

  constructor(private http: HttpClient) {}

  // paginated - used for the employee table
  getAll(page: number = 0, size: number = 10): Observable<Page<EmployeeResponse>> {
    return this.http.get<Page<EmployeeResponse>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  // non-paginated - used for employee caching in devices/incidents
  getAllUnpaged(): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.apiUrl}/${id}`);
  }

  create(employee: EmployeeRequest): Observable<EmployeeResponse> {
    return this.http.post<EmployeeResponse>(this.apiUrl, employee);
  }

  update(id: number, employee: EmployeeRequest): Observable<EmployeeResponse> {
    return this.http.put<EmployeeResponse>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}