import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { GET_RELATED_PRODUCTS, GET_CART_DETAILS, GET_PRODUCT_DETAILS, ADD_TO_CART, GET_PRODUCT_CDS_DETAILS, GET_FLASHING_CONFIGURATION, GET_FLASHING_SKU_CODE } from './endPointURL';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) { }

  public getRelatedProducts(productCode?: any): Observable<any> {
    let url = GET_RELATED_PRODUCTS.url + productCode;
    return this.http
      .get<any>(url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getProductDetailsResults(productCode?: any, rootCategory?: any): Observable<any> {
    let apiURL = '';
    if (!this.isNullOrEmpty(rootCategory)) {
      apiURL = GET_PRODUCT_DETAILS(productCode).url + '&rootCategory=' + rootCategory;
    } else {
      apiURL = GET_PRODUCT_DETAILS(productCode).url;
    }
    return this.http
      .get<any>(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getFlashingConfigurations(productCode?: any): Observable<any> {
    let apiURL = GET_FLASHING_CONFIGURATION(productCode).url;
    return this.http
      .get<any>(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getProductCDSDetailsResults(productCode?: any): Observable<any> {
    let apiURL = GET_PRODUCT_CDS_DETAILS(productCode).url;
    return this.http
      .get<any>(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getCartInfo(cartId: any): any {
    const apiURL = (cartId && cartId !== " ") ? (GET_CART_DETAILS?.url + '/' + cartId) : GET_CART_DETAILS?.url;
    return this.http
      .get<any>(apiURL, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public createCartId(): Observable<any> {
    return this.http
      .post<any>(GET_CART_DETAILS?.url, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getFlashingSKUCode(payLoad: any): Observable<any> {
    let apiURL = GET_FLASHING_SKU_CODE.url;
    return this.http.post(apiURL, payLoad, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public addToCart(payLoad: any, cartId: any): Observable<any> {
    let apiURL = ADD_TO_CART(cartId).url;
    return this.http.post(apiURL, payLoad, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  // Check if any value is empty or undefined
  isNullOrEmpty(value: any): boolean {
    return value == null || value == undefined || value == "" || value == " ";
  }
}
