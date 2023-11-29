import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFacetsComponent } from './product-facets.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import {PageSlotModule } from '@spartacus/storefront';



@NgModule({
  declarations: [
    ProductFacetsComponent
  ],
  imports: [
    CommonModule,
    PageSlotModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductRefinementComponent: {
          component: ProductFacetsComponent
        }
      }
    } as CmsConfig)
  ],
  exports:[ProductFacetsComponent]
})
export class ProductFacetsModule { }
