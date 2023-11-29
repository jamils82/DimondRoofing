import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule } from '@spartacus/core';
import { LayoutConfig } from '@spartacus/storefront';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {

      },
      layoutSlots: {
        header: {
          lg: {
            slots: [
              'MarketingContext', 
              'SiteLinks', 
              'SiteLogo',
              'NavigationBar',
            ],
          },
          slots: [
            'MarketingContext',
            'PreHeader',
            'SiteLogo',
            'SearchBox',
            'SiteLinks',
          ],
        },
        navigation: {
          lg: { slots: [] },
          slots: [
            'NavigationBar'
          ],
        },
        footer: {
          slots: ['Footer'],
        },
        LandingPage2Template: {
          slots: [
            'Section5',
          ],
        },
        NotFoundPageTemplate:{
          slots:[
            'MiddleContent',
          ]
        },
        RequestAccessPageTemplate:{
          slots:[
            // 'SiteLogo',
            'RequestAccessHeader',
            'RequestAccessForm'
          ]
        },
        CategoryGridPageTemplate:{
          slots:[ 
            'CategoryGridSlot-CategoryGridPage'
          ]
        },
        SearchResultsGridPageTemplate: {
          slots: [
            'SearchResultsGridSlot'],
        },
        ProductGridPageTemplate:{
          slots:[
            'ProductGridSlot'
          ]
        },
        ProductDetailsPageTemplate: {
          lg: {
            pageFold: 'UpSelling',
          },
          pageFold: 'Summary',
          slots: [
            'Summary',
          ]
        },
        OrderSummaryTemplate: {
          slots: [
            'UserDetailCheckout',
            'OrderSummaryCheckout',
          ]
        },
        OrderCheckoutTemplate: {
          slots: [
            'UserDetailCheckout',
            'OrderInfoCheckout',
            'SiteDeliverySlot'
          ]
        },
        AccountPageTemplate: {
          slots: [
            'OrderListContext',
            'OrderDetailContext',
            'BodyContent',
            'SideContent',
            'CustomAccountContext',
            'CustomPreferencesSlot',
            'CustomMyReportsSlot',
            'CustomMyDeliveriesSlot',
            'CustomMyDeliveryDetailsSlot',
            'CustomFiltersExplanationSlot'
          ]
        },
        SavedCartDetailsPageTemplate: {
           slots:[
             'BodyContent',
             'SideContent'
            ]
        }
      },
    } as LayoutConfig),

  ],
})
export class CustomLayoutRoutingModule { }
