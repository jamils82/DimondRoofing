import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateAccountComponent } from './create-account.component';
import { MediaModule, PageSlotModule } from '@spartacus/storefront';
import { CreateAccountsService } from 'src/app/shared/services/create-accounts.service';
import { CmsConfig, ConfigModule } from '@spartacus/core';
import { ShareEvents } from 'src/app/shared/services/shareEvents.service';

@NgModule({
  declarations: [CreateAccountComponent],
  imports: [
    CommonModule,
    MediaModule,
    PageSlotModule,
    BrowserModule,
    ReactiveFormsModule,
    ConfigModule.withConfig({
      cmsComponents: {
        RequestAccessHtmlForm: {
          component: CreateAccountComponent
        }
      },
      routing: {
        protected: true,
        routes: {
          contact: {
              paths: ['create-account'],
              protected: false
          },
        }
      }
    } as CmsConfig),
  ],
  exports: [
    CreateAccountComponent
  ],
  providers:[
    CreateAccountsService,
    ShareEvents
  ]
  
})
export class CreateAccountModule { }
