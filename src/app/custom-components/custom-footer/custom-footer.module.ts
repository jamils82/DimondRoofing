import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule, CmsConfig, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, PageSlotModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { CustomFooterComponent } from './custom-footer.component';
import { CustomSocialFooterModule } from './custom-social-footer/custom-social-footer.module';



@NgModule({
  declarations: [CustomFooterComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    PageSlotModule,
    CustomSocialFooterModule,
    
    ConfigModule.withConfig({
      cmsComponents: {
        CustomFooterComponent: {
          component: CustomFooterComponent
        }
      }
    } as CmsConfig)
  ]
})
export class CustomFooterModule { }
