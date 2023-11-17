import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  constructor(private http: HttpClient) {}

  getCountryList(): Observable<any> {
    return this.http.get<Array<any>>(`https://restcountries.com/v3.1/all`).pipe(
      tap({
        next: (teams) => {
          return teams;
        },
        error: (err) => {
          return err;
        },
      })
    );
  }
}
