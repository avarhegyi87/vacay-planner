import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from '@vacay-planner/models';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamService {
  constructor(private http: HttpClient) {}

  myTeams(): Observable<any> {
    return this.http.get<Array<any>>('/api/teams/myteams').pipe(
      tap({
        next: (teams) => {
          return teams;
        },
        error: (err) => {
          return [];
        },
      })
    );
  }

  addTeam(params: {
    teamName: string;
    countryCode: string;
    minAvailability?: number;
  }): Observable<Team> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>('/api/teams/addteam', params, { headers }).pipe(map(
      response => {
        console.log('service response:', response);
        return response;
      }
    ))
  }

  addMember(params: {userId: number, teamId: number}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('/api/teams/addmember', params, { headers });
  }
}
