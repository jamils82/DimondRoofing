import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  DELETE_CART_ENTRY_ENDPOINT,
  GET_CART_LIST_ENDPOINT,
  GET_ORDER_DETAIL,
  UPDATE_CART_ENTRY_ENDPOINT
} from 'src/app/core/services/endPointURL';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  expandAll = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }

  public getCartList(cartId: any, sortBy?: any): Observable<any> {
    let url = GET_CART_LIST_ENDPOINT.url + cartId + '?fields=FULL';
    if (sortBy != undefined)
      url = url + sortBy
    return this.http
      .get(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }


  public getOrderDetails(orderId: any): Observable<any> {
    let url = GET_ORDER_DETAIL.url + orderId + '?fields=DEFAULT&needBase64MediaURL=true';
    return this.http
      .get(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public deleteCartEntry(cartId: any, entryNumber: any): Observable<any> {
    let url =
      DELETE_CART_ENTRY_ENDPOINT.url + cartId + '/entries/' + entryNumber;
    return this.http
      .delete(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public clearCart(cartId: any): Observable<any> {
    let url = DELETE_CART_ENTRY_ENDPOINT.url + cartId;
    return this.http
      .delete(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public updateCartEntry(cartId: any, entryNumber: any, payLoad: any): Observable<any> {
    let url = UPDATE_CART_ENTRY_ENDPOINT.url + cartId + '/bpEntries/' + entryNumber;
    return this.http.put(url, payLoad, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}
