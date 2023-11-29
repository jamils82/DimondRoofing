import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'src/app/core/config/utils/utils';

@Component({
  selector: 'app-product-facets',
  templateUrl: './product-facets.component.html',
  styleUrls: ['./product-facets.component.scss']
})
export class ProductFacetsComponent implements OnInit , OnChanges {
  @Input() customFacetsData: any;
  facetsData: any = [];
  selectedFacets: string = '';
  @Output() facetsQuery = new EventEmitter<any>();
  @Output() mobileFacets = new EventEmitter<any>();
  show: boolean = false;
  showDetails: any = [];
  selectedFacetsNames: any = [];
  @Input() totalResults?: number = 1;
  isDesktop = true;
  isMobile = false;
  isTablet = false;
  showWaitCursor = new BehaviorSubject<boolean>(false);
  isPLPPage: boolean = false;
  disabled: boolean = false;
  constructor(public cd: ChangeDetectorRef, private cmsService: CmsService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.customFacetsData.previousValue != changes?.customFacetsData.currentValue) {
      setTimeout(() => {
        this.disabled=false;
      }, 100);
    }
    this.getFacetsData();
  }
  ngOnInit(): void {
    this.showWaitCursor.next(true);
    this.getFacetsData();
  }
  getFacetsData(){ 
    //this.showWaitCursor.next(true);
    this.cmsService.getCurrentPage().subscribe((data: any) => {
       if (data.template == 'ProductGridPageTemplate') {
        this.isPLPPage = true;
      }
    })
    this.onPageRefresh();
    setTimeout(() => {
      if (this.customFacetsData && this.customFacetsData != undefined) {
        this.facetsData = JSON.parse(JSON.stringify(this.customFacetsData));
        this.cd.markForCheck();
        for (let i = 0; i < this.customFacetsData.length; i++) {
          this.showDetails[i] = false;
        }
      }
      this.showWaitCursor.next(false);
    }, 1000);
    this.cd.markForCheck();
  }
  clearAllClick() {
    this.showWaitCursor.next(true);
    this.facetsQuery.emit('');
    setTimeout(() => {
      if (this.customFacetsData && this.customFacetsData != undefined) {
        this.facetsData = JSON.parse(JSON.stringify(this.customFacetsData));
      }
      this.cd.markForCheck();
      this.showWaitCursor.next(false);
    }, 2000);
  }
  showResults() {
    this.mobileFacets.emit();
  }
  checkValue(event: any, data: any) {
    const name = data.name;
    if (event.currentTarget.checked) {
      this.selectedFacetsNames.push(name);
      data.selected = true;
    } else {
      const ind = this.selectedFacetsNames.findIndex(
        (element: any) => element == name
      );
      if (ind > -1) this.selectedFacetsNames.splice(ind, 1);
      data.selected = false;
    }
    let value = decodeURIComponent(data?.query?.query?.value);
    const selectedNames: any = this.selectedFacetsNames;
    this.facetsQuery.emit({ value, selectedNames });
    this.disabled=true;
    this.cd.markForCheck();
  }
  showMore(ind: any) {
    this.showDetails[ind] = !this.showDetails[ind];
  }

  onResize(event: any) {
    event.target.innerWidth;
    if (event.target.innerWidth < 992) {
      this.isMobile = true;
      this.isDesktop = false;
    } else {
      this.isDesktop = true;
    }
  }

  onPageRefresh() {
    this.isMobile = CommonUtils.isMobile();
    this.isTablet = CommonUtils.isTablet();
    this.isDesktop = CommonUtils.isDesktop();
  }
}
