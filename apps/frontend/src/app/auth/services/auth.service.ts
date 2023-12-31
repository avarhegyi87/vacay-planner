/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { User } from '@vacay-planner/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenicatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenicatedSubject.asObservable();

  private isVerifiedUserSubject = new BehaviorSubject<boolean>(false);
  isVerifiedUser$ = this.isVerifiedUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('/api/auth/login', credentials, { headers }).pipe(
      tap(() => this.isAuthenicatedSubject.next(true)),
    );
  }

  register(params: { email: string; username: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('/api/auth/register', params, { headers }).pipe(tap(() => this.isAuthenicatedSubject.next(true)));
  }

  sendVerificationEmail(params: { id: number }) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post('/api/auth/verify', params, { headers }).pipe(
      map(response => {
        return response;
      }),
    );
  }

  googleAuth(): void {
    window.location.href = '/api/auth/google';
  }

  logout(): Observable<any> {
    return this.http.post('/api/auth/logout', {}).pipe(tap(() => this.isAuthenicatedSubject.next(false)));
  }

  getUser(): Observable<User> {
    return this.http.get<User>('/api/auth/current_user').pipe(
      tap(user => {
        if (user && Object.keys(user).length > 0 && Object.prototype.hasOwnProperty.call(user, 'id')) {
          this.isAuthenicatedSubject.next(true);
          this.isVerifiedUserSubject.next(user.is_verified);
        } else {
          this.isAuthenicatedSubject.next(false);
          this.isVerifiedUserSubject.next(false);
        }
      }),
    );
  }

  getUserId(): Observable<any> {
    return this.http.get<any>('/api/auth/current_user').pipe(
      tap({
        next: user => {
          return user?.id;
        },
        error: err => {
          return err;
        },
      }),
    );
  }
}
