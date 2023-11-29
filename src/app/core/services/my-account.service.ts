import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GET_INVOICE_CREDIT_SEARCH_RESULTS, GET_INVOICE_CREDIT_STATUSES, INVOICE_CREDIT_SORTING_ENDPOINT, MYACCOUNT_GET_INVOICE_CREDIT } from './endPointURL';

@Injectable({
  providedIn: 'root'
})
export class MyAccountService {
  constructor(private http: HttpClient) { }
  public setOrderNumber(orderNumber: string) {
    sessionStorage.setItem('orderNumber', orderNumber);
  }
  public getOrderNumber() {
    return sessionStorage.getItem('orderNumber');;
  }
  public getInvoicesCreditList(data?: any, currentPage?: any): Observable<any> {
    let url = MYACCOUNT_GET_INVOICE_CREDIT.url;
    let params = new HttpParams();
    params = params.set("currentPage", currentPage)
    return this.http.post(url, data, { params: params }) as Observable<any>;
  }

  public sortInvoiceCredit(data: any, reqPayload: any): Observable<any> {
    let url = INVOICE_CREDIT_SORTING_ENDPOINT.url + data;
    return this.http.post(url, reqPayload, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getInvoiceCreditStatuses(): Observable<any> {
    let url = GET_INVOICE_CREDIT_STATUSES.url;
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

  public getInvoiceCreditSearchResults(data: any,currentPage?: any): Observable<any> {
    let params = new HttpParams();
    params = params.set("currentPage", currentPage)
    let url = GET_INVOICE_CREDIT_SEARCH_RESULTS.url;
    return this.http.post(url, data, { params: params })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getStatementsList(data: any, currentPage?: any): Observable<any> {
    let url = GET_INVOICE_CREDIT_SEARCH_RESULTS.url;
    let params = new HttpParams();
    params = params.set("currentPage", currentPage)
    return this.http.post(url, data, { params: params }) as Observable<any>;
  }

}
