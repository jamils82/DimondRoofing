import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryParagraphComponent } from './category-paragraph.component';
import { PageSlotModule } from '@spartacus/storefront';



@NgModule({
  declarations: [
    CategoryParagraphComponent
  ],
  imports: [
    CommonModule,
    PageSlotModule
  ],
  exports:[CategoryParagraphComponent]
})
export class CategoryParagraphModule { }
