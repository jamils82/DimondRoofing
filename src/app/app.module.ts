import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, OnChanges, OnInit } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpartacusModule } from './spartacus/spartacus.module';
import { CustomLayoutRoutingModule } from "./core/config/custom-layout/custom-layout.module";
import { CustomFooterModule } from "./custom-components/custom-footer/custom-footer.module";
import { HomepageModule } from "./custom-components/homepage/homepage.module";
import { SearchBoxModule } from "@spartacus/storefront";
import { ProductCategoryModule } from "./custom-components/product-category/product-category.module";
import { CreateAccountModule } from "./custom-components/create-account/create-account.module";
import { SpartacusAuth0ModuleConfig } from "./shared/auth0/spartacusauth0.config";
import { Auth0ModuleConfigModule } from "./shared/auth0/auth0-module-config.module";
import { CustomCategoryModule } from "./custom-components/custom-category/custom-category.module"
import { ProductFacetsModule } from "./shared/components/product-facets/product-facets.module"
import { CustomProductModule } from "./custom-components/custom-product/custom-product.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TokenValidatorService } from "./shared/interceptors/token-validator.service";
import { NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgbDateCustomParserFormatter } from "./shared/services/ngb-date-custom-parser-formatter.service";
import { PreferencesModule } from "./custom-components/preferences/preferences.module";
import { AdminGuard } from "@spartacus/organization/administration/core";
import { CustomAciveGuardService } from "./shared/guards/custom-acive-guard.service";
import {
  SpaCustomHeaderModule,
  CustomOrderHistoryModule,
  CustomOrderDetailsModule,
  CustomSavedCartModule,
  CustomCartModule,
  MyAccountModule,
  CustomSavedCartDetailsModule,
  CheckoutModule,
  MyTeamModule,
  MyDeliveriesModule,
  DeliveryDetailsModule,
  MyReportsModule
} from 'buildingproduct-library';
import { environment } from "src/environments/environment";

import { ForbiddenHandler, GlobalMessageConfig } from "@spartacus/core";
import { CustomGlobalMessageService } from "./shared/services/custom-global-message.service";
import { AboutFiltersModule } from "./custom-components/about-filters/about-filters.module";

const listOfModules: any = [
  SpaCustomHeaderModule.forRoot(environment),
  MyAccountModule.forRoot(environment),
  CustomCartModule.forRoot(environment)
]
if (localStorage.getItem('isLogedIn') == 'true') {
  let numberOfLoads = Number(sessionStorage.getItem('numberOfLoads') || 0) 
  numberOfLoads += 1;
  sessionStorage.setItem('numberOfLoads', numberOfLoads.toString());
  if (numberOfLoads > 0 ) {
    listOfModules.push(CustomSavedCartModule.forRoot(environment))
    listOfModules.push(CustomSavedCartDetailsModule.forRoot(environment))
    listOfModules.push(CheckoutModule.forRoot(environment))
    listOfModules.push(CustomOrderHistoryModule.forRoot(environment))
    listOfModules.push(CustomOrderDetailsModule.forRoot(environment))
    listOfModules.push(MyTeamModule.forRoot(environment))
    listOfModules.push(MyDeliveriesModule.forRoot(environment))
    listOfModules.push(DeliveryDetailsModule.forRoot(environment))
    listOfModules.push(MyReportsModule.forRoot(environment))
  }
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SpartacusAuth0ModuleConfig,
    Auth0ModuleConfigModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SpartacusModule,
    BrowserTransferStateModule,
    CustomLayoutRoutingModule,
    CustomFooterModule,
    HomepageModule,
    SearchBoxModule,
    ProductCategoryModule,
    CreateAccountModule,
    ProductFacetsModule,
    CustomCategoryModule,
    CustomProductModule,
    ...listOfModules,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDaterangepickerMd.forRoot(),
    PreferencesModule,
    AboutFiltersModule

  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: AdminGuard, useClass: CustomAciveGuardService },
    { provide: HTTP_INTERCEPTORS, useClass: TokenValidatorService, multi: true },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    {
      provide: ForbiddenHandler,
      useClass: CustomGlobalMessageService
    }
  ]
})

export class AppModule {

}
