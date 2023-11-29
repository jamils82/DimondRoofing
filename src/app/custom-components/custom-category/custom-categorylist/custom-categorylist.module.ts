import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCategorylistComponent } from './custom-categorylist.component';
import { MediaModule } from '@spartacus/storefront';



@NgModule({
  declarations: [
    CustomCategorylistComponent
  ],
  imports: [
    CommonModule,
    MediaModule,
  ],
  exports:[CustomCategorylistComponent]
})
export class CustomCategorylistModule { }
