import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError,  } from 'rxjs/operators';
import { GET_CART_LIST_ENDPOINT, PLACE_ORDER } from 'src/app/core/services/endPointURL';

@Injectable({
  providedIn: 'root',
})
export class OrderReviewService {
  constructor(private http: HttpClient) {}

  public getOrderReview(cartId: any): Observable<any> {
    let url = GET_CART_LIST_ENDPOINT.url + cartId + '?fields=FULL';
    return this.http.get(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public orderPlaceAPI(cartId: any): Observable<any> {
    let url = PLACE_ORDER.url + cartId +'&termsChecked=true';
    return this.http.post(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}
