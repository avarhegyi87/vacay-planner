import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserAttributes } from '@vacay-planner/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenicatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenicatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post('/api/login', credentials)
      .pipe(tap(() => this.isAuthenicatedSubject.next(true)));
  }

  register(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post('/api/register', credentials)
      .pipe(tap(() => this.isAuthenicatedSubject.next(true)));
  }

  logout(): Observable<any> {
    return this.http
      .post('/api/logout', {})
      .pipe(tap(() => this.isAuthenicatedSubject.next(false)));
  }

  getUser(): Observable<UserAttributes> {
    return this.http.get<UserAttributes>('/api/current_user').pipe(
      tap((user) => {
        if (user && Object.keys(user).length > 0 && user.hasOwnProperty('id'))
          this.isAuthenicatedSubject.next(true);
        else this.isAuthenicatedSubject.next(false);
      })
    );
  }
}
