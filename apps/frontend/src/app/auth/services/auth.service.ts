import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenicatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenicatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post('/api/login', credentials, { headers })
      .pipe(tap(() => this.isAuthenicatedSubject.next(true)));
  }

  register(params: {
    email: string;
    username: string;
    password: string;
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post('/api/register', params, { headers })
      .pipe(tap(() => this.isAuthenicatedSubject.next(true)));
  }

  googleAuth(): void {
    window.location.href = '/auth/google';
  }

  logout(): Observable<any> {
    return this.http
      .post('/api/logout', {})
      .pipe(tap(() => this.isAuthenicatedSubject.next(false)));
  }

  getUser(): Observable<any> {
    return this.http.get<any>('/api/current_user').pipe(
      tap((user) => {
        if (user && Object.keys(user).length > 0 && user.hasOwnProperty('id')) {
          this.isAuthenicatedSubject.next(true);
        } else {
          this.isAuthenicatedSubject.next(false);
        }
      })
    );
  }
}
