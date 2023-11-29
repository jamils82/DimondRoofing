import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCategorygridComponent } from './custom-categorygrid.component';
import { MediaModule } from '@spartacus/storefront';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMasonryModule } from 'ngx-masonry';



@NgModule({
  declarations: [
    CustomCategorygridComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    NgxMasonryModule,
    MediaModule
  ],
  exports:[CustomCategorygridComponent]
})
export class CustomCategorygridModule { }
