import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedNewsUpdatesComponent } from './shared-news-updates/shared-news-updates.component';
import { RouterModule } from '@angular/router';
import { UrlModule } from '@spartacus/core';
import { MediaModule, IconModule, BreadcrumbModule, PageSlotComponent, PageSlotModule } from '@spartacus/storefront';
import { WelcomeTextComponent } from './welcome-text/welcome-text.component';
import { CustomBreadcrumModule } from 'buildingproduct-library';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatRadioModule } from '@angular/material/radio';
import { SaveCartService } from '../services/save-cart.service';
import { CustomDatePipe } from '../pipes/custom-date-pipe.pipe';
import { NgxMasonryModule } from 'ngx-masonry';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    SharedNewsUpdatesComponent,
    WelcomeTextComponent,
    CustomDatePipe,

  ],
  imports: [
    CommonModule,
    PageSlotModule,
    BrowserAnimationsModule,
    MediaModule,
    IconModule,
    UrlModule,
    RouterModule,
    BreadcrumbModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    MatRadioModule,
    NgbToastModule,
    MatDialogModule,
    NgxMasonryModule,
    NgxDaterangepickerMd.forRoot(),
    CustomBreadcrumModule,
    PageSlotModule
  ],
  exports: [
    SharedNewsUpdatesComponent,
    WelcomeTextComponent,
    CustomBreadcrumModule,
    CustomDatePipe,
  ],
  providers: [SaveCartService, CustomDatePipe, DatePipe]
})
export class SharedComponentsModule { }
