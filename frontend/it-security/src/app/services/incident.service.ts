import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private apiUrl = 'http://your-api-url/incidents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Incident[]> {
    // TODO: implement
    return this.http.get<Incident[]>(this.apiUrl);
  }

  getById(id: number): Observable<Incident> {
    // TODO: implement
    return this.http.get<Incident>(`${this.apiUrl}/${id}`);
  }

  create(incident: Partial<Incident>): Observable<Incident> {
    // TODO: implement
    return this.http.post<Incident>(this.apiUrl, incident);
  }

  update(id: number, incident: Partial<Incident>): Observable<Incident> {
    // TODO: implement
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, incident);
  }

  delete(id: number): Observable<void> {
    // TODO: implement
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}