import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomProductComponent } from './custom-product.component';
import { ProductFacetsModule } from 'src/app/shared/components/product-facets/product-facets.module';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { CustomCategorylistModule } from '../custom-category/custom-categorylist/custom-categorylist.module';
import { CustomCategorygridModule } from '../custom-category/custom-categorygrid/custom-categorygrid.module';
import { CategoryParagraphModule } from '../custom-category/category-paragraph/category-paragraph.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomProductIntroComponent } from './custom-product-intro/custom-product-intro.component';
import { MediaModule, PageSlotModule } from '@spartacus/storefront';
import { CustomProductSummaryComponent } from './custom-product-summary/custom-product-summary.component';
import { CustomProductDetailsComponent } from './custom-product-details/custom-product-details.component';
import { NgbModule, NgbToastModule  } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { OnlyNumber } from 'src/app/shared/directives/onlyNumbers.directive';
import { CustomProductAttributesComponent } from './custom-product-attributes/custom-product-attributes.component';
import { CustomProductRelatedComponent } from './custom-product-related/custom-product-related.component';
import { CustomFileUploadComponent } from './custom-file-upload/custom-file-upload.component';
import { CustomDirectivesModule } from 'src/app/shared/directives/custom-directives.module';

@NgModule({
  declarations: [
    CustomProductComponent,
    CustomProductIntroComponent,
    CustomProductDetailsComponent,
    OnlyNumber,
    CustomProductSummaryComponent,
    CustomProductAttributesComponent,
    CustomProductRelatedComponent,
    CustomFileUploadComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    PageSlotModule,
    ProductFacetsModule,
    CustomCategorylistModule,
    CustomCategorygridModule,
    CategoryParagraphModule,
    SharedComponentsModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    MediaModule,
    NgbModule,
    NgbToastModule,
    CustomDirectivesModule,
    ConfigModule.withConfig({
      cmsComponents: {
        SearchResultsGridComponent: {
          component: CustomProductComponent,
        },
        ProductIntroComponent: {
          component: CustomProductIntroComponent
        },
        ProductSummaryComponent: {
          component: CustomProductDetailsComponent
        }
        // CMSProductListComponent: {
        //   component: CustomProductComponent,
        // },
      },
    } as CmsConfig),

  ],
  exports: [
    CustomProductIntroComponent,
    CustomProductDetailsComponent,
    CustomProductSummaryComponent,
  ]
})
export class CustomProductModule { }
