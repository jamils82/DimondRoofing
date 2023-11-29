import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlModule } from '@spartacus/core';
import { IconModule, MediaModule, PageSlotModule } from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { CustomSocialFooterComponent } from './custom-social-footer.component';



@NgModule({
  declarations: [CustomSocialFooterComponent],
  imports: [
    CommonModule,
    MediaModule,
    IconModule,
    UrlModule,
    PageSlotModule,
    RouterModule,
  ],
  exports:[CustomSocialFooterComponent]
})
export class CustomSocialFooterModule { }
