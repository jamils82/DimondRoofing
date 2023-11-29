import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { RoutingService } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAccountDetailServiceService } from '../services/user-account-detail-service.service';
import { GlobalMessageService, GlobalMessageType, } from '@spartacus/core';
@Injectable({
  providedIn: 'root'
})

export class CustomAciveGuardService implements CanActivate {
  disableViewOrders: boolean = false;
  disableTeams: boolean = false;
  disableInvoices: boolean = false;
  public _isDataLoaded = new BehaviorSubject<boolean>(true);
  constructor(public userAccountFacade: UserAccountFacade,
    public router: Router,
    protected globalMessageService: GlobalMessageService,
    public permissionService: UserAccountDetailServiceService,
    protected routingService: RoutingService,) {
    this.setCheckPermissions();
  }
  
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url = route.url[0].path;
    return new Promise<boolean>((resolve) => {
      this._isDataLoaded.subscribe((isloaded: any) => {
        if (isloaded == true) {
          if (url == 'orders' && this.disableViewOrders == true) {
            this.showError();
            resolve(false);
          }
          if (url == 'organization' && this.disableTeams == true) {
            this.showError();
            resolve(false);
          }
          if (url == 'account' && this.disableInvoices == true) {
            this.showError();
            resolve(false);
          }
          else {
            resolve(true);
          }
        }
      })
    })

  }
  showError() {
    this.globalMessageService.add('No sufficient permissions to access this page', GlobalMessageType.MSG_TYPE_WARNING, 5000);
    this.routingService.go({ cxRoute: 'home' });
  }
  public setCheckPermissions() {
    this.permissionService.getUserAccount().subscribe((data: any) => {
      if (data != undefined) {

        let permissionlist = data?.roles;
        if (permissionlist.length > 0) {
          for (let permission of permissionlist) {

            if (permission == 'B2B Administrator') {
              this.disableTeams = true;
            }
            if (permission == 'B2B Supervisor') {
            }

            if (permission == 'B2B Purchaser') {
              this.disableTeams = true;
              this.disableInvoices = true;
            }
            if (permission == 'B2B Payments') {
              //this.disableTeams = true;
              this.disableViewOrders = true; //Orders & Deliveries page.
            }
            if (permission == 'B2B Specifier') {
              this.disableInvoices = true;
            }
            if (permission == 'B2B Support') {
              this.disableTeams = true;
              this.disableInvoices = true;
            }
          }
          this._isDataLoaded.next(true);
        }
      }
    });

  }
}
