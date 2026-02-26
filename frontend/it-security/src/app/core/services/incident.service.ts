import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncidentRequest, IncidentResponse } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private apiUrl = 'http://localhost:8080/api/incidents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IncidentResponse[]> {
    return this.http.get<IncidentResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<IncidentResponse> {
    return this.http.get<IncidentResponse>(`${this.apiUrl}/${id}`);
  }

  create(incident: IncidentRequest): Observable<IncidentResponse> {
    return this.http.post<IncidentResponse>(this.apiUrl, incident);
  }

  update(id: number, incident: IncidentRequest): Observable<IncidentResponse> {
    return this.http.put<IncidentResponse>(`${this.apiUrl}/${id}`, incident);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  downloadDailyReport(): Observable<Blob> {
    return this.http.get('http://localhost:8080/api/reports/daily', {
      responseType: 'blob'
    });
  }

}