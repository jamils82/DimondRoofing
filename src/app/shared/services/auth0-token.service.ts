import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStorageService, AuthToken } from '@spartacus/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { AUTH0_GET_TOKEN } from 'src/app/core/services/endPointURL';

@Injectable({
  providedIn: 'root'
})
export class Auth0TokenService {
  constructor(private http: HttpClient, private authStorageService: AuthStorageService) { }


  protected _token$: Observable<AuthToken> = new BehaviorSubject<AuthToken>(
    {} as AuthToken
  );

  protected _decodeToken: any = null;

  getDecodeToken(): any {
    return this._decodeToken;

  }

  isTokenAvaiable(): boolean {
    if (localStorage.getItem('spartacus⚿⚿auth')) {
      const tok: any = localStorage.getItem('spartacus⚿⚿auth')
      const tokenFromLS: any = JSON.parse(tok)
      const auth0AccessToken = tokenFromLS.token

      // ** decode token present 
      if (!this._decodeToken) {
        this.setDecodeToken(auth0AccessToken)
      }
      return (auth0AccessToken.access_token) ? true : false;
    }
    return false;

  }
  getAuth0Token(): Observable<AuthToken> {

    return this._token$;
  }

  setDecodeToken(token: AuthToken): void {

    if (token.access_token) {
      const decoded: any = jwtDecode<JwtPayload>(token.access_token);
      let tokenTemp: any = { email: "", fromSignup: "", phoneNumber: "", surname: "", firstName: "" };
      tokenTemp.email = decoded[`${environment.UIsiteURl}/email`];
      tokenTemp.fromSignup = decoded[`${environment.UIsiteURl}/fromSignup`];
      tokenTemp.phoneNumber = decoded[`${environment.UIsiteURl}/phoneNumber`];
      tokenTemp.surname = decoded[`${environment.UIsiteURl}/surname`];
      tokenTemp.firstName = decoded[`${environment.UIsiteURl}/firstName`];
      localStorage.setItem('fromSignup', tokenTemp.fromSignup);
      this._decodeToken = tokenTemp

    }


  }
  /**
   * Set current value of token.
   *
   * @param token
   */
  setToken(token: AuthToken): void {
    this.setDecodeToken(token);
    this.authStorageService.setToken(token);
    (this._token$ as BehaviorSubject<AuthToken>).next(token);
  }

}
