import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutFiltersComponent } from './about-filters.component';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { PageSlotModule } from '@spartacus/storefront';

@NgModule({
  declarations: [AboutFiltersComponent],
  imports: [
    CommonModule,
    PageSlotModule,
    SharedComponentsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CustomFiltersExplanationComponent: {
          component: AboutFiltersComponent,
        },
      },
    } as CmsConfig),
  ],
})
export class AboutFiltersModule {}
