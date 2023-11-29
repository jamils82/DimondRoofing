import { ChangeDetectorRef, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CurrentProductService } from '@spartacus/storefront';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-custom-product-details',
  templateUrl: './custom-product-details.component.html',
  styleUrls: ['./custom-product-details.component.scss']
})
export class CustomProductDetailsComponent implements OnInit, OnChanges {

  promotions: any;

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

}
