import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-custom-product-intro',
  templateUrl: './custom-product-intro.component.html',
  styleUrls: ['./custom-product-intro.component.scss']
})
export class CustomProductIntroComponent implements OnInit, OnChanges {

  product$: Observable<Product | null> = this.currentProductService.getProduct();
  promotions: any;
  currentProduct = this.product$ as Product;

  constructor(
    private currentProductService: CurrentProductService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  getThumbnail(product: any) {
    return product?.images?.PRIMARY?.thumbnail?.url;
  }

}

