import { Component, OnInit } from '@angular/core';
import { CmsService, User } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { AccountDropdownStateService } from 'src/app/shared/services/account-dropdown-state.service';
import { UserAccountDetailServiceService } from 'src/app/shared/services/user-account-detail-service.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  navigationData: any[] = [];
  tilesData: any[] = [];
  showWaitCursor = new BehaviorSubject<boolean>(true);
  disableViewOrders: boolean = true;
  disableTeams: boolean = true;
  disableInvoices: boolean = true;
  disableReports: boolean = true;
  constructor(
    public acctDropService: AccountDropdownStateService,
    public permissionService: UserAccountDetailServiceService,
    public cmsService: CmsService) { }

  async ngOnInit() {
    this.disableInvoices = await this.permissionService.isInvoiceStatementGroupPermission();
    this.disableTeams = await this.permissionService.isCreateInviteGroupPermission();
    this.disableViewOrders = await this.permissionService.isViewOrdersPermission();
    this.disableReports = await this.permissionService.isReportPermission();
    this.acctDropService.navigationsData.subscribe((data: any) => {
      this.tilesData = [];
      if (data && data.length > 0) {
        this.tilesData = data;
        this.showWaitCursor.next(false)
      }
    })
    this.cmsService.getCurrentPage().subscribe((ytList: any) => {
      if (ytList) {
        this.navigationData = [];
        let listItems = ytList.slots?.Section1?.components;
        if (listItems && listItems.length > 0)
          for (let i = 0; i < listItems.length; i++) {
            this.cmsService.getComponentData(listItems[i].uid).subscribe((data) => {
              if (data) {
                this.navigationData.push(data);
              }
            })
          }
      }
    })
  }
  tilesNavigation(urlLink: string) {
    if (urlLink == '/my-account/orders' && this.disableViewOrders == false) {
      return
    }
    else if (urlLink == '/organization/users' && this.disableTeams == false) {
      return
    }
    else if (urlLink == '/account' && this.disableInvoices == false) {
      return
    } 
    else if (urlLink == '/reports' && this.disableReports == false) {
      return
    } else {
      window.location.href = urlLink
    }
  }
}
