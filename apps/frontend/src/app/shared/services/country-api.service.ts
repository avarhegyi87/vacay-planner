/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  private publicHolidayCache: { [key: string]: any } = {};
  constructor(private http: HttpClient) {}

  getCountryList(): Observable<any> {
    return this.http.get<Array<any>>('https://restcountries.com/v3.1/all').pipe(
      tap({
        next: teams => {
          return teams;
        },
        error: err => {
          return err;
        },
      }),
    );
  }

  getPublicHolidayAPIkey(): Observable<string> {
    return this.http.get<string>('/api/calendars/public-holiday-api-key').pipe(
      catchError(() => of('')),
    );
  }

  getPublicHolidays(year: number, countryCode: string): Observable<any> {
    if (this.publicHolidayCache[countryCode]) return of(this.publicHolidayCache[countryCode]);
    
    return this.getPublicHolidayAPIkey().pipe(
      catchError(error => {
        console.error('Error fetching Public Holiday API key', error);
        return of('');
      }),
      switchMap(apiKey => {
        if (!apiKey) return of(null);

        return this.http
          .get(`https://public-holiday.p.rapidapi.com/${year}/${countryCode}`, {
            headers: {
              'X-RapidAPI-Key': apiKey ?? '',
              'X-RapidAPI-Host': 'public-holiday.p.rapidapi.com',
            },
          }).pipe(tap(holidays => (this.publicHolidayCache[countryCode] = holidays)));
      }),
    );
  }
}
