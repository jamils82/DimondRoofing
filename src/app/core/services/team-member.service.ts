import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AVAILABLE_ORGUNIT_ENDPOINT, CREAT_MYTEAM_MEMBER_ENDPOINT, GETALL_ORGUNIT_ENDPOINT, GET_ALL_ROLES_ENDPOINT, GET_MYTEAM_LIST_ENDPOINT, MYTEAM_MEMBER_SORTING_ENDPOINT, UPDATESTATUS_MYTEAM_LIST_ENDPOINT, UPDATE_MYTEAM_MEMBER_ENDPOINT } from './endPointURL';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {

  constructor(private http: HttpClient) { }

  public getMyTeamList(pageSize: number, currentPage: number, sortBy?: any): Observable<any> {
    let url = GET_MYTEAM_LIST_ENDPOINT.url + 'currentPage=' + currentPage + '&pageSize=' + pageSize;
    if(sortBy != '' || sortBy == undefined){
      url = url + '&sort=' + sortBy;
    }
    
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  public activeDeactive(data: any): Observable<any> {
    let url = UPDATESTATUS_MYTEAM_LIST_ENDPOINT.url + data.customerId;
    return this.http.patch(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public createMember(data: any): Observable<any> {
    let url = CREAT_MYTEAM_MEMBER_ENDPOINT.url;
    return this.http.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public updateMember(data: any): Observable<any> {
    let url = UPDATE_MYTEAM_MEMBER_ENDPOINT.url + data.customerId;
    return this.http.patch(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public sortMyTeam(data: any): Observable<any> {
    let url = MYTEAM_MEMBER_SORTING_ENDPOINT.url + data;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public availableOrgUnits(): Observable<any> {
    let url = AVAILABLE_ORGUNIT_ENDPOINT.url;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getAllOrgUnits(): Observable<any> {
    let url = GETALL_ORGUNIT_ENDPOINT.url;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getAllRoles(): Observable<any> {
    let url = GET_ALL_ROLES_ENDPOINT.url;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

}
