import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountDropdownStateService {

  private cartValue = new BehaviorSubject<any>({});
  public navigationsData = new BehaviorSubject<any>([]);
  constructor() { }
  
  setCartValue(value: any) {
    this.cartValue.next(value);
  }
}
