/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

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

  getPublicHolidays(year: number, countryCode: string): Observable<any> {
    if (this.publicHolidayCache[countryCode]) return of(this.publicHolidayCache[countryCode]);

    return this.http
      .get(`https://public-holiday.p.rapidapi.com/${year}/${countryCode}`, {
        headers: {
          'X-RapidAPI-Key': process.env['PUBLIC_HOLIDAY_API_KEY'] ?? '',
          'X-RapidAPI-Host': 'public-holiday.p.rapidapi.com',
        },
      })
      .pipe(tap(holidays => (this.publicHolidayCache[countryCode] = holidays)));
  }
}
