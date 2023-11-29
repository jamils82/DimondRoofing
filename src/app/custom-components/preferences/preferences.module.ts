import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CmsConfig, ConfigModule } from '@spartacus/core'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreferencesComponent } from './preferences.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { PageSlotModule } from '@spartacus/storefront';


@NgModule({
  declarations: [
    PreferencesComponent
  ],
  imports: [
    CommonModule,
    PageSlotModule,
    SharedComponentsModule,
    FormsModule,
    NgbModule,
    NgbToastModule,
    ReactiveFormsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CustomPreferencesPageComponent: {
          component: PreferencesComponent
        }
      }
    } as CmsConfig)
  ]
})
export class PreferencesModule { }
