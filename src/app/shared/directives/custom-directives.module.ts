import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPaginationDirective } from './custom-paginatior.directive';
import { DropzoneDirective } from './dropzone.directive';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { DigitonlyDirective } from './digitonly.directive';



@NgModule({
  declarations: [AppPaginationDirective, DropzoneDirective, NumbersOnlyDirective, DigitonlyDirective],
  imports: [
    CommonModule
  ], 
  exports: [AppPaginationDirective, DropzoneDirective, NumbersOnlyDirective, DigitonlyDirective]
})
export class CustomDirectivesModule { }
