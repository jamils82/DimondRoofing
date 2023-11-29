import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { BehaviorSubject, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserAccountDetailServiceService {
  _isCreateInviteGroup: boolean = false;
  _isViewOrdersGroup: boolean = false;
  _isPricingGroup: boolean = false;
  _isPlaceOrdersGroup: boolean = false;
  _isAccountManagementGroup: boolean = false;
  _isAccountOwnerGroup: boolean = false;
  _isInvoiceStatement: boolean = false;
  _isICart: boolean = false;
  _currentEmail: any = '';
  _isReport: boolean = false;
  public _isDataLoaded = new BehaviorSubject<boolean>(false);
  currentUID: any = '';

  constructor(private auth: AuthService, private userAccount: UserAccountFacade,
    private router: Router) {
  }


  public getUserAccount() {
    return this.auth.isUserLoggedIn().pipe(
      switchMap((isUserLoggedIn) => {
        if (isUserLoggedIn) {
          return this.userAccount.get();
        } else {
          return of(undefined);
        }
      })
    );
  }
  public getIsUserLoggedIn() {
    return this.auth.isUserLoggedIn();
  }

  public setCheckPermissions() {
    this.getUserAccount().subscribe((data: any) => {
      if (data != undefined) {
        //  this.emailId = data.uid;
        this._currentEmail = data.uid;
        this.currentUID = localStorage.getItem('selectedIUID');
        let permissionlist = data?.roles;
        if (permissionlist.length > 0) {
          sessionStorage.setItem('role', permissionlist[0]);
          for (let permission of permissionlist) {

            if (permission == 'B2B Owner') {
              this._isAccountOwnerGroup = true;
              this._isCreateInviteGroup = true;
              this._isPricingGroup = true;
              this._isViewOrdersGroup = true; //Orders & Deliveries page.
              this._isAccountManagementGroup = true;
              this._isPlaceOrdersGroup = true;
              this._isInvoiceStatement = true;
              this._isICart = true;
              this._isReport = true;
            }
            if (permission == 'B2B Manager') {
              this._isAccountOwnerGroup = true;
              this._isCreateInviteGroup = true;
              this._isPricingGroup = true;
              this._isViewOrdersGroup = true; //Orders & Deliveries page.
              this._isAccountManagementGroup = true;
              this._isPlaceOrdersGroup = true;
              this._isInvoiceStatement = true;
              this._isICart = true;
              this._isReport = true;
            }
            if (permission == 'B2B Administrator') {
              this._isAccountOwnerGroup = true;
              this._isPricingGroup = true;
              this._isViewOrdersGroup = true; //Orders & Deliveries page.
              this._isAccountManagementGroup = true;
              this._isPlaceOrdersGroup = true;
              this._isInvoiceStatement = true;
              this._isICart = true;
              this._isReport = true;
            }
            if (permission == 'B2B Supervisor') {
              this._isPricingGroup = true;
              this._isCreateInviteGroup = true;
              this._isViewOrdersGroup = true; //Orders & Deliveries page.
              this._isPlaceOrdersGroup = true;
            }

            if (permission == 'B2B Purchaser') {
              this._isPricingGroup = true;
              this._isViewOrdersGroup = true;
              this._isICart = true;
            }
            if (permission == 'B2B Payments') {
              this._isCreateInviteGroup = true;
              this._isPricingGroup = true;
              this._isViewOrdersGroup = true; //Orders & Deliveries page.
              this._isPlaceOrdersGroup = true;
              this._isInvoiceStatement = true;
            }
            if (permission == 'B2B Specifier') {
              this._isPricingGroup = true;
              this._isCreateInviteGroup = true;
              this._isPlaceOrdersGroup = true;
            }
            if (permission == 'B2B Support') {
              this._isCreateInviteGroup = true;
              this._isViewOrdersGroup = true;
            }
          }
          this._isDataLoaded.next(true);
        }  else {
          this._isDataLoaded.next(true);
        }
      }
    });

  }

  public isAccountOwnerPermission() {
    return this._isAccountOwnerGroup;
  }
  
  public isCreateInviteGroupPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isCreateInviteGroup);
        }
      })
    });
  }

  public isInvoiceStatementGroupPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isInvoiceStatement);
        }
      })
    });
  }

  public isPricingPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isPricingGroup);
        }
      })
    });
  }

  public isCartPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isICart);
        }
      })
    });
  }
  public isReportPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isReport);
        }
      })
    });
  }
  public isViewOrdersPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isViewOrdersGroup);
        }
      })
    });

  }

  public isPlaceOrdersPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isPlaceOrdersGroup);
        }
      })
    });
  }

  public navigateToHome() {
    this.router.navigate(['/']);
  }

  public isAccountManagementPermission() {
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isDataLoaded) => {
        if (isDataLoaded) {
          resolve(this._isAccountManagementGroup);
        }
      })
    });
  }

  public getCurrentEmail() {
    return this._currentEmail;
  }


}
