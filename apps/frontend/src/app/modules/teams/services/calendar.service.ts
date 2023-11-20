import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingleEntry } from '@vacay-planner/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor(private http: HttpClient) {}

  getMonthlyCalendar(params: { userId: number; teamId: number; year: number; month: number }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get('/api/calendars/get', { headers, params });
  }

  updateCalendars(params: { teamId: number; year: number; entries: Array<SingleEntry> }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('/api/calendars/update', params, { headers });
  }
}
