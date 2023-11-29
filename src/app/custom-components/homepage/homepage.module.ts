import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage.component';
import { CmsConfig, ConfigModule, UrlModule } from '@spartacus/core';
import { IconModule, MediaModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';



@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    SharedComponentsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        PageTitleComponent: {
          component: HomepageComponent
        }
      }
    } as CmsConfig)
  ]
})
export class HomepageModule { }
