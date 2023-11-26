/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from '@vacay-planner/models';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private teamsSubject = new BehaviorSubject<Array<Team>>([]);
  public teams$ = this.teamsSubject.asObservable();

  constructor(private http: HttpClient) {}

  myTeams(): Observable<any> {
    return this.http.get<Array<any>>('/api/teams/myteams').pipe(
      tap(teams => {
        return teams;
      }),
    );
  }

  getMembers(teamId: number): Observable<any> {
    return this.http.get<any>(`/api/teams/${teamId}/getmembers`);
  }

  getTeamInfo(teamId: number): Observable<Team> {
    return this.http.get<Team>(`/api/teams/${teamId}/getteaminfo`);
  }

  addTeam(params: { teamName: string; countryCode: string; minAvailability?: number }): Observable<Team> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>('/api/teams/addteam', params, { headers }).pipe(
      map(response => {
        return response;
      }),
    );
  }

  addMember(params: { userId: number; teamId: number }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('/api/teams/addmember', params, { headers });
  }
}
