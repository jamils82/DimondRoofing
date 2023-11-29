import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCategoryComponent } from './custom-category.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { MediaModule } from '@spartacus/storefront';
import { ProductFacetsModule } from 'src/app/shared/components/product-facets/product-facets.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CustomCategorylistModule } from './custom-categorylist/custom-categorylist.module';
import { CustomCategorygridModule } from './custom-categorygrid/custom-categorygrid.module';
import { CategoryParagraphModule } from './category-paragraph/category-paragraph.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    CustomCategoryComponent,
    
  ],
  imports: [
    CommonModule,
    ProductFacetsModule,
    MediaModule,
    CustomCategorylistModule,
    CustomCategorygridModule,
    CategoryParagraphModule,
    SharedComponentsModule,
    InfiniteScrollModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductGridComponent: {
          component: CustomCategoryComponent
        }
      }
    } as CmsConfig)
  ],
  exports:[]
})
export class CustomCategoryModule { }
