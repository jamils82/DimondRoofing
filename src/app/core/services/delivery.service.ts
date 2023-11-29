import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  GET_DELEVERY_DETAILS,
  GET_DELEVERY_LIST,
  GET_POD_DOWNLOAD,
} from "./endPointURL";

@Injectable({
  providedIn: "root",
})
export class DeliveryService {
  constructor(private http: HttpClient) {}

  public getDeliveryDetails(consignmentNo: any): Observable<any> {
    let url = GET_DELEVERY_DETAILS?.url + consignmentNo;
    return this.http
      .get(url, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getDeliveryList(currentPage?: any): Observable<any> {
    let url = GET_DELEVERY_LIST(currentPage || 0)?.url;
    return this.http
      .get(url, {
        headers: { "Content-Type": "application/json" },
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public podDownloadFile(
    documentCode?: any,
    consignmentId?: any
  ): Observable<any> {
    // documentCode = 'TestPOD23'; Added for testing we can use for demo
    // consignmentId = 'DelveryNo-5';
    let url =
      GET_POD_DOWNLOAD?.url + documentCode + "&consignmentId=" + consignmentId;
    return this.http
      .get(url, {
        headers: { 'Content-Type': 'image/jpeg'},
        responseType: 'blob'
      })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
}
