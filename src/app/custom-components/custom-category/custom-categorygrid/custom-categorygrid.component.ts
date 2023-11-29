import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { CommonUtils } from 'src/app/core/config/utils/utils';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-custom-categorygrid',
  templateUrl: './custom-categorygrid.component.html',
  styleUrls: ['./custom-categorygrid.component.scss']
})
export class CustomCategorygridComponent implements OnInit, OnChanges {
  @Input() categoriesData: any = [];
  @Input() clpPage: boolean = false;
  storeFrontUrl = environment.UIsiteURl;
  rootCategory: any = '';
  @ViewChild(NgxMasonryComponent, { static: true }) masonry: NgxMasonryComponent;
  isDesktop = true;
  isMobile = false;
  isTablet = false;
  updateData: any = [];
  newData: any = [];

  constructor(
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.onPageRefresh();
    const cat = window.location.search.split('=').pop();
    if (cat != undefined && cat != '')
      this.rootCategory = '?rootCategory=' + cat;
  }
 ngOnChanges(changes: SimpleChanges): void {

  if (changes?.categoriesData?.previousValue != changes?.categoriesData?.currentValue) {
    if(this.categoriesData.length >= this.updateData.length){
      this.newData = this.categoriesData.slice(this.updateData.length, this.categoriesData.length);
      this.updateData=[...this.updateData, ...this.newData];
      this.masonry?.add(this.newData);
      this.cd.detectChanges();
    } else{
      this.newData = this.categoriesData.slice(0, this.categoriesData.length);
      this.updateData=[...this.categoriesData];
      this.masonry?.add(this.newData);
      this.cd.detectChanges();
    }

  }
 }

  onPageRefresh() {
    this.isMobile = CommonUtils.isMobile();
    this.isTablet = CommonUtils.isTablet();
    this.isDesktop = CommonUtils.isDesktop();
  }


  onResize(event: any) {
    event.target.innerWidth;
    if (event.target.innerWidth < 992) {
      this.isDesktop = false;
    }
    else {
      this.isDesktop = true;
    }
  }
  getImageGridview(data: any) {
    let imageUrl;
    imageUrl = data?.images?.filter(
      (img: any) => img.format == "zoom"
    );
    return imageUrl;
  }
}
