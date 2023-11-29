import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CHANGE_BRANCH, FIND_STORE } from "./endPointURL";
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FindStoreService {
  private homeBranchName = new BehaviorSubject<any>('');
  homeBranch = this.homeBranchName.asObservable();

  homeBranchApi(newUser: any) {
    this.homeBranchName.next(newUser);
  }

  constructor(private http: HttpClient) { }

  public changeBranch(data: any): Observable<any> {
    const cartVal: any = localStorage.getItem('spartacus⚿dimond-spa⚿cart');
    const cartID = JSON.parse(cartVal)?.active;
    let url = CHANGE_BRANCH.url + data +'&cartId=' + cartID;
    return this.http.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  public getAllStores(latAndlong?: any): Observable<any> {
    let url;
    if (latAndlong.lat != undefined && latAndlong.long != undefined) {
      url = FIND_STORE.url + '&latitude=' + latAndlong.lat + '&longitude=' + latAndlong.long + '&fields=FULL';
    }
    else {
      url = FIND_STORE.url +'fields=FULL';
    }
    return this.http.get(url)
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }
}
