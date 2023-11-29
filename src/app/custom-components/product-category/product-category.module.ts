import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { RouterModule } from '@angular/router';
import { UrlModule, ConfigModule, CmsConfig } from '@spartacus/core';
import { MediaModule, IconModule, PageSlotModule } from '@spartacus/storefront';
import { ProductCategoryComponent } from './product-category.component';



@NgModule({
  declarations: [
    ProductCategoryComponent
  ],
  imports: [
    
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    PageSlotModule,
    SharedComponentsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductCategoryPageTileComponent: {
          component: ProductCategoryComponent
        }
      }
    } as CmsConfig)
  ]
})
export class ProductCategoryModule { }
