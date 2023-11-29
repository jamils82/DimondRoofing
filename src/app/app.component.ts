import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthStorageService, AuthToken, GlobalMessageService, GlobalMessageType, RoutingService } from '@spartacus/core';
import { filter } from 'rxjs/operators';
import { Auth0TokenService } from './shared/services/auth0-token.service';
import { UserAccountDetailServiceService } from './shared/services/user-account-detail-service.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Dimond Roofing';
  auth0ReQ: any = {};
  getToken$: any;
  isAccountPermission: boolean = true;
  isTeamPermission: boolean = true;
  isOrderPermissions: boolean = true;
  isCartPermission: boolean = true;
  isReportPermision: boolean = true;
  showWaitCursor = new BehaviorSubject<boolean>(true);
  constructor(
    private router: Router,
    protected globalMessageService: GlobalMessageService,
    private authStorageService: AuthStorageService,
    private userProfileDetailsService: UserAccountDetailServiceService,
    protected routingService: RoutingService,
    private elementRef: ElementRef,
    private auth0TokenService: Auth0TokenService) {

  }
  async ngOnInit() {
    this.checkPermissions(window.location.pathname);
    this.userProfileDetailsService.setCheckPermissions();
    this.isAccountPermission = await this.userProfileDetailsService.isInvoiceStatementGroupPermission();
    this.isTeamPermission = await this.userProfileDetailsService.isCreateInviteGroupPermission();
    this.isOrderPermissions = await this.userProfileDetailsService.isViewOrdersPermission();
    this.isCartPermission = await this.userProfileDetailsService.isCartPermission();
    this.isReportPermision = await this.userProfileDetailsService.isReportPermission();
    const path = window.location.pathname;

    this.checkPermissions(path);
    if (path.includes('users') || !path.includes('order'))
      sessionStorage.removeItem('selectedOrderFilters');
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: any) => {
      // Handle route change here
      if (path.includes('users') || !path.includes('order'))
        sessionStorage.removeItem('selectedOrderFilters');
      this.checkPermissions(event.url);
    });
    if (path.includes('login')) {
      window.location.href = '/';
    }
    if (this.auth0TokenService.isTokenAvaiable()) {
      this.userProfileDetailsService.setCheckPermissions();
      this.loginRegFloanNav();
    } else {
      this.callTokenservice();
    }
    setTimeout(() => {
      if (path.includes('checkout') || path.includes('review-order')) {
        const headerHeight = this.elementRef.nativeElement.querySelector('.UserDetailCheckout').offsetHeight;
        const breadcrumbs = document.querySelector('app-custom-breadcrum') as HTMLElement;
        if (breadcrumbs) {
          breadcrumbs.style.top = `${headerHeight}px`;
          breadcrumbs.style.zIndex = '3';
        }
      }  else {
        const headerHeight = this.elementRef.nativeElement.querySelector('.header').offsetHeight;
        const breadcrumbs = document.querySelector('app-custom-breadcrum') as HTMLElement;
        if (breadcrumbs)
          breadcrumbs.style.top = `${headerHeight}px`;
      }
    }, 2000);
  }
  checkPermissions(url: any) {
    if (url == '/account' && this.isAccountPermission == false)
      this.navigatetoHome();
    if (url == '/organization' && this.isTeamPermission == false)
      this.navigatetoHome();
    if (url == '/my-account/orders' && this.isOrderPermissions == false)
      this.navigatetoHome();
    if (url == '/reports' && this.isReportPermision == false)
        this.navigatetoHome();
    if ((url == '/checkout' || url == '/cart') && this.isCartPermission == false)
      this.navigatetoHome();
  }
  navigatetoHome() {
    this.globalMessageService.add('No sufficient permissions to access this page', GlobalMessageType.MSG_TYPE_WARNING, 5000);
    this.routingService.go({ cxRoute: 'home' });
  }
  loginRegFloanNav() {
    let accountCount = 0;
    if (sessionStorage.getItem('initalFlowCheck')) return;
    sessionStorage.setItem('initalFlowCheck', 'true');
    const decodeToken: any = this.auth0TokenService.getDecodeToken();
    // *** have to create decodeToken
    if (decodeToken && !decodeToken.fromSignup && !(window.location.href.includes('/p/')) && !(window.location.href.includes('/order/')) && !(window.location.href.includes('/search/'))) this.router.navigate(['/']);
    else {
      const tok: any = localStorage.getItem('userInfo')
      let data = JSON.parse(tok);
      if (data != undefined) {
        if (data?.orgUnit?.children && data?.orgUnit?.children?.length > 0) {
          data?.orgUnit?.children.forEach((element: any) => {
            if (element.selected == true) {
              accountCount += 1;
            }
          });
          if (accountCount > 0 && !(window.location.href.includes('/p/')) && !(window.location.href.includes('/search/'))) {
            this.router.navigate(['/']);
          }
        }
      }
    }
  }

  @HostListener('click', ['$event.target']) onClick(e: any) {
    if (e.classList?.contains('customer-service-icon')) {
      if (document.getElementsByClassName('helpSupport').length > 0) {
        document.getElementsByClassName('helpSupport')[0].classList?.toggle('show');
      }
    }
    else {
      if (document.getElementsByClassName('helpSupport').length > 0) {
        document.getElementsByClassName('helpSupport')[0].classList?.remove('show');
      }
    }
  }
  callTokenservice() {
    //this.getToken$ = this.auth0TokenService.getAuth0Token();
    this.getToken$ = this.authStorageService.getToken();
    this.getToken$.subscribe((data: any) => {
      if (data.access_token) {
        this.auth0TokenService.setDecodeToken(data);
        let token = data.access_token; //'tonpkRz63W_iyFoveyDtDF6iA_Q';
        localStorage.setItem('token', token);
        this.loginRegFloanNav();
      }
    });
  } //


}