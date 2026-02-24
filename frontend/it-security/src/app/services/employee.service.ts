import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://your-api-url/employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    // TODO: implement
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getById(id: number): Observable<Employee> {
    // TODO: implement
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(employee: Partial<Employee>): Observable<Employee> {
    // TODO: implement
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(id: number, employee: Partial<Employee>): Observable<Employee> {
    // TODO: implement
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    // TODO: implement
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}