import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonUtils } from 'src/app/core/config/utils/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-product-related',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './custom-product-related.component.html',
  styleUrls: ['./custom-product-related.component.scss']
})
export class CustomProductRelatedComponent implements OnInit {
  @Input() relatedProductsData: any;
  isDesktop: boolean = true;
  isMobile: boolean = false;
  isTablet: boolean = false;
  imageBaseUrl:any = environment.occBaseUrl;
  constructor() { }

  ngOnInit(): void {
        this.onPageRefresh();

  }
  // Change view based on screen size/window size
  onResize(event: any): void {
    const targetWidth = event.target.innerWidth;
    if (targetWidth < 768) {
      this.isMobile = true;
      this.isDesktop = false;
    } else if (targetWidth < 992) {
      this.isTablet = true;
      this.isDesktop = false;
    } else {
      this.isDesktop = true;
    }
  }
  onPageRefresh(): void {
    this.isMobile = CommonUtils.isMobile();
    this.isTablet = CommonUtils.isTablet();
    this.isDesktop = CommonUtils.isDesktop();
  }

}
