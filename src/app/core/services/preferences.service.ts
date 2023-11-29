import { Injectable } from '@angular/core';
import { GET_CURRENT, PATCH_PREFERENCES_DATA } from './endPointURL';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(private http: HttpClient) {}
  public sendPreferencesEmail(data: any): Observable<any> {
    let url = PATCH_PREFERENCES_DATA.url;
    return this.http.patch(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
  
  public GetCurrent(): Observable<any> {
    return this.http.get(GET_CURRENT().url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}
