import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TokenValidatorService implements HttpInterceptor {


  constructor(
    private auth: AuthService,) { }
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    let url: any = request.url;
    if ( url.includes('/users/anonymous/consenttemplates') ) {
      // Return an empty observable to cancel the request
      const modifiedRequest = request.clone({
        url: this.modifyUrl(request.url),
      });
  
      return next.handle(modifiedRequest);
    }

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      if (error && (error.status === 401 || error.status === 403)) {
        const url: any = request.url;
        if (!url.includes('listOfAccounts')) {
          this.auth.logout({ returnTo: environment.UIsiteURl + '/' });
          localStorage.clear();
          sessionStorage.clear();
          // window.location.href = '/';
        }
      }
      return throwError(error);
    }));
  }
  private modifyUrl(url: string): string {
    // Modify the URL as per your requirements
    return url.replace('/users/anonymous/consenttemplates?lang=en_NZ&curr=NZD', '/users/current/consenttemplates');
  }
}
