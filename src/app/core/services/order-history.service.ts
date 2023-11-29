import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GET_ORDER_DETAIL, GET_ORDER_HISTORY_SEARCH_RESULTS, GET_ORDER_HISTORY_SEARCH_STATUSES, ORDER_HISTORY_SORTING_ENDPOINT } from './endPointURL';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  constructor(private http: HttpClient) { }

  public getOrderHistoryList(data:any ,currentPage?: any): Observable<any> {
    let url = GET_ORDER_HISTORY_SEARCH_RESULTS.url;
    let params = new HttpParams();
    params = params.set("currentPage", currentPage)
    return this.http.post(url, data, { params: params } ) as Observable<any>;
  }
  
  public getOrderDetailList(orderID:any): Observable<any> {
    let url = GET_ORDER_DETAIL.url + orderID;
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

  public getOrderHistorySearchStatuses(): Observable<any> {
    let url = GET_ORDER_HISTORY_SEARCH_STATUSES.url;
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

  public getOrderHistorySearchResults(data: any,currentPage?: any): Observable<any> {
    let params = new HttpParams();
    params = params.set("currentPage", currentPage)
    let url = GET_ORDER_HISTORY_SEARCH_RESULTS.url;
    return this.http.post(url, data, { params: params })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public sortOrderHistory(data: any, reqPayload: any): Observable<any> {
    let url = ORDER_HISTORY_SORTING_ENDPOINT.url + data;
    return this.http.post(url, reqPayload, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}
