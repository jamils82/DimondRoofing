import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';
import { Cart_Clone_And_Save, Saved_Cart_For_Later, Saved_Cart_Url, GET_SAVED_CART, Get_Saved_Carts } from 'src/app/core/services/endPointURL';

@Injectable({
  providedIn: 'root'
})
export class SaveCartService {
  public cartId: number = 0;
  protected savedCartId$ = this.routingService.getRouterState().pipe(
    map((routingData) => routingData.state.params.savedCartId),
    distinctUntilChanged()
  );
  constructor(private http: HttpClient,
    protected routingService: RoutingService) {
    this.savedCartId$.subscribe(data => {
      const loc: any = localStorage.getItem('spartacus⚿dimond-spa⚿cart')
      const activeCart = JSON.parse(loc)?.active;
      this.cartId = data != undefined ? data : activeCart;
    })
  }
  public getSavedCarts(): Observable<any> {
    let url = Get_Saved_Carts().url;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }
  
  public getSavedCartDetails(cartId: any): Observable<any> {
    let url = GET_SAVED_CART(cartId).url;
    return this.http.get(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  public cloneAndSave(cartId: number, name: string): Observable<any> {
    let url = Cart_Clone_And_Save(cartId).url + name;
    return this.http.post(url, cartId, {observe: 'response'})
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  public deleteSavdCart(cartId: number): Observable<any> {
    let url = Saved_Cart_Url(cartId).url;
    return this.http.delete(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }
  public markCartForActive(cartId: number): Observable<any> {
    let url = Saved_Cart_Url(cartId).url + '/restoresavedcart';
    return this.http.patch(url, cartId ,{observe: 'response'})
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }
  public saveCartForLater(name: string, description: string): Observable<any> {
    let url = Saved_Cart_For_Later(this.cartId).url + 'saveCartName=' + name + '&saveCartDescription=' + description;
    return this.http.patch(url, {
      headers: { 'Content-Type': 'application/json' },
    })
      .pipe(
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

}
