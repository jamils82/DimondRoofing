import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CHECKOUT_REVIEW_ORDER_ENDPOINT,
  GET_ADDRESS_INFO,
  GET_Checkout_Details_URL,
  GET_Delivery_Modes_URL,
  Validate_Order_Date_time,
} from './endPointURL';

@Injectable({
  providedIn: 'root',
})
export class CustomCheckoutService {
  constructor(public http: HttpClient) {}

  public getCheckOutValues(cartId: any): Observable<any> {
    let url = GET_Checkout_Details_URL(cartId).url;
    return this.http.get(url).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  public getDeliveryModes(cartId: any): Observable<any> {
    let url = GET_Delivery_Modes_URL(cartId).url;
    return this.http.get(url)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  public getAddressInfo(): Observable<any> {
    let url = GET_ADDRESS_INFO.url;
    return this.http.get(url).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }
  public ValidateCheckoutDateTime(data: any): Observable<any> {
    let url = Validate_Order_Date_time.url + '?fields=FULL'; //  + '?fields=FULL&'  + "&cartID=" + data.cartID + "&deliveryPickUpDate=" +  '05/01/2023' + '&deliveryMethod=' + data.deliveryMethod + '&deliveryPickUpFromTime=' + data.deliveryPickUpFromTime + '&deliveryPickUpToTime=' + data.deliveryPickUpToTime;
    return this.http.post(url, data).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }
  public checkoutReviewAndOrder(checkoutData: any): Observable<any> {
    return this.http
      .post(CHECKOUT_REVIEW_ORDER_ENDPOINT.url, checkoutData)
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getGeoLocationAddress(apiURL: any, location: any): Observable<any> {
    apiURL = apiURL + '&longitude=' + location.longitude + '&latitude=' + location.latitude;
    return this.http.get(apiURL).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }


  public getClickGeoLocationAddress(apiURL: any, location: any): Observable<any> {
    apiURL = apiURL + '&x=' + location.longitude + '&y=' + location.latitude;
    return this.http.get(apiURL).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }
  public getToken(apiURL: any): Observable<any> {
    return this.http.get(apiURL).pipe(
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }


}
