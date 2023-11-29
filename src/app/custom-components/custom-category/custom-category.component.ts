import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { categorySearchUrl } from 'src/app/core/services/endPointURL';
import { CommonUtils } from 'src/app/core/config/utils/utils';
import { CmsService } from '@spartacus/core';
import { CustomSearchService } from 'src/app/core/services/search.service';
import { BrowserModule, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-custom-category',
  templateUrl: './custom-category.component.html',
  styleUrls: ['./custom-category.component.scss'],
})
export class CustomCategoryComponent implements OnInit {
  listview: boolean = true;
  isDataLoaded: boolean = false;
  responseData: any;
  breadcrumbData: any = [];
  showWaitCursor = new BehaviorSubject<boolean>(false);
  loaderImage = new BehaviorSubject<boolean>(false);
  isDesktop = true;
  isMobile = false;
  isTablet = false;
  facetsData: any = [];
  facetsValues: string = '';
  selectedNames: any = [];
  token: any;
  categoryName: string = '';
  categoryTitle: string = 'Products';
  pageTemplateName: string = '';
  categoryPage: boolean = false;
  currentPage = 0;
  categoryCount = 20;
  facetsClicked: boolean = false;
  categoryCode: string = '';
  totalResults: any = 0;
  categoryURL: any;
  islandName: string = '';
  showSelectedFilters: boolean = true;
  @ViewChild('filterModal') facetPopup: any;
  breadcrumbTop: any = '40px';
  constructor(
    public http: HttpClient,
    private cmsService: CmsService,
    private searchService: CustomSearchService,
    private cd: ChangeDetectorRef,
    private titleService: Title

  ) {

  }

  ngOnInit(): void {
    this.breadcrumbData.push({ url: '/', name: 'Home' });
    let category = window.location.pathname.split('/');
    this.categoryName = category[category.length - 1];
    const code: any = localStorage.getItem('branchDetails');
    this.categoryCode = JSON.parse(code)?.categoryCode;
    this.islandName = JSON.parse(code)?.islandName;
    this.cmsService.getCurrentPage().subscribe((data: any) => {
      this.pageTemplateName = data.template;
      if (this.pageTemplateName == 'CategoryGridPageTemplate') {
        this.categoryPage = true;
        this.getCategoryApiRespose();
        this.titleService.setTitle('Category Listing Page');
        localStorage.setItem('rootCategory', this.categoryName);
      } else if (this.pageTemplateName == 'ProductGridPageTemplate') {
        this.categoryPage = false;
        this.getProductApiRespose();
        this.titleService.setTitle('Product Listing Page');

      }
    })
    this.onPageRefresh();
  }
  gridView() {
    this.listview = false;
  }
  listView() {
    this.listview = true;
  }
  getSelectedFacets(selectedFacets: any) {
    this.facetsValues = selectedFacets.value;
    //this.showWaitCursor.next(true);
    if (this.categoryPage) {
      this.getCategoryApiRespose();
    } else {
      this.currentPage = 0;
      this.facetsClicked = true;
      this.getProductApiRespose();
    }

  }
  mobileFacetsClose() {
    this.facetPopup.nativeElement.click();
  }
  getCategoryApiRespose() {
    let url: any = ''
    let catCode: any;
    if (this.facetsValues == '' || this.facetsValues == undefined ) {
      catCode = ':relevance:' + 'island:' + this.categoryCode + ':allCategories:' + this.categoryName;
      url = categorySearchUrl.url + this.categoryName + '&query=' + catCode;
    }
    else {
      url = categorySearchUrl.url + this.categoryName + '&query=' + this.facetsValues;
    }
    this.http.get(url).subscribe((data: any) => {
      if (data) {
        this.breadcrumbData = [];
        this.breadcrumbData.push({ url: '/', name: 'Home' });
        let allData = data;
        this.totalResults = allData?.subCategories?.length;
        this.responseData = allData?.subCategories?.slice(0, 20);
        this.facetsData = allData.facets;
        this.getSelectedFacetsNames();
        if (allData.breadcrumbs) {
          let categoryCode = allData?.breadcrumbs[(allData.breadcrumbs).length - 1];
          this.categoryTitle = categoryCode?.facetValueName;
          allData.breadcrumbs.forEach((element: any) => {
            this.breadcrumbData.push({ name: element.facetValueName, url: 'c/' + element.facetValueName });
          });
          this.breadcrumbData[1] = { name: 'Products', url: '/c/1' }
        }

        this.isDataLoaded = true;
        this.showWaitCursor.next(false);
      }
    }, error => {
      this.showWaitCursor.next(false);
    })
  }
  getSelectedFacetsNames() {
    let selectedFacets = [];
    this.selectedNames = this.islandName;
    if (this.facetsData && this.facetsData.length > 0) {
      for (let i = 0; i < this.facetsData.length; i++) {
        for (let j = 0; j < this.facetsData[i]?.values?.length; j++) {
          if (this.facetsData[i]?.values[j]?.selected == true) {
            selectedFacets.push(this.facetsData[i]?.values[j].name)
          }
        }
      }
      if(selectedFacets && selectedFacets.length > 0)
      this.selectedNames = selectedFacets.join(', ')
    }
    this.showSelectedFilters = selectedFacets.length > 0 ? true: false;
  }
  arraysEqual(a1: any, a2: any) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1) == JSON.stringify(a2);
  }
  getProductApiRespose() {
    //this.currentPage=0;
    this.breadcrumbData.push({ url: '/', name: 'Home' });
    let category = window.location.pathname.split('/');
    this.categoryName = category[category.length - 1];
    let catCode: string = this.categoryName;
    let rootCategory: any;
    const rootCode: any = localStorage.getItem('rootCategory');
    const cat = window.location.search.split('=').pop();
    if (!this.isNullOrEmpty(cat))
      rootCategory = cat;
    if (rootCategory == undefined)
      rootCategory = rootCode;
    if (this.facetsValues) {
      catCode = this.facetsValues;
    } else {
      //future requirement 
      catCode = ':relevance:' + 'island:' + this.categoryCode + ':allCategories:' + this.categoryName;
      // catCode = ':relevance'+ ':allCategories:' + this.categoryName;
    }
    this.searchService.getProductsData(catCode, this.categoryCode, this.currentPage, rootCategory).subscribe((data: any) => {
      if (data) {
        this.breadcrumbData = [];
        this.breadcrumbData.push({ url: '/', name: 'Home' });
        let proData = data;
        const responseData = proData.products;
        if (this.facetsClicked) {
          this.responseData = responseData;
          this.facetsClicked = false;
        } else {
          this.responseData = this.responseData && this.responseData.length > 0 && !this.arraysEqual(this.responseData, responseData) ? this.responseData.concat(responseData) : responseData;
        }
        this.totalResults = data?.pagination?.totalResults;
        this.facetsData = proData.facets;
        let categoryCode = proData.breadcrumbs[(proData.breadcrumbs).length - 1];
        this.categoryTitle = categoryCode?.facetValueName;
        this.getSelectedFacetsNames();
        data.breadcrumbs.forEach((element: any) => {
          this.breadcrumbData.push({
            name: element.facetValueName, url: !this.isNullOrEmpty(rootCategory) && this.breadcrumbData.length > 1
              ? 'c/' + element.facetValueCode + '?rootCategory=' + rootCategory : 'c/' + element.facetValueCode
          });
        });
        this.isDataLoaded = true;
        this.showWaitCursor.next(false);
      }
    })
  }
  onLoadProductApiRespose(currentPage: any) {
    //this.currentPage=0;
    this.breadcrumbData = [];
    this.breadcrumbData.push({ url: '/', name: 'Home' });
    // let category = window.location.pathname.split('/');
    // this.categoryName = category[category.length - 1];
    this.searchService.getProductsData(this.categoryName, this.categoryCode, currentPage).subscribe((data: any) => {
      if (data) {
        let proData = data;
        if (data?.products?.length > 0) {
          let myData = data.products;
          this.responseData = this.responseData.concat(myData)
        }

        this.totalResults = data?.pagination?.totalResults;
        this.facetsData = proData.facets;
        // data?.products.forEach((element: any) => {
        //   this.responseData = [...this.responseData, element];
        // });
        let categoryCode = proData.breadcrumbs[(proData.breadcrumbs).length - 1];
        this.categoryTitle = categoryCode?.facetValueName;
        proData.breadcrumbs.forEach((element: any) => {
          this.breadcrumbData.push({ name: element.facetValueName, url: 'c/' + element.facetValueCode });
        });
        this.isDataLoaded = true;
        this.showWaitCursor.next(false);
      }
    })
  }
  viewMoreClick() {
    this.loaderImage.next(true);
    setTimeout(() => {
      this.currentPage += 1;
      this.categoryCount += 20;
      if (this.categoryPage) {
        this.categoryURL = categorySearchUrl.url + this.categoryName + '&query=' + this.facetsValues;
        this.http.get(this.categoryURL).subscribe((data: any) => {
          this.responseData = data.subCategories.slice(0, this.categoryCount);
          this.responseData = [...this.responseData];
          this.totalResults = data?.subCategories?.length;
          this.cd.markForCheck();
          this.loaderImage.next(false);
        })
      } else {
        this.getProductApiRespose();
        this.loaderImage.next(false);
      }
    }, 2000);




  }

  onScroll() {
    if (this.totalResults > this.responseData?.length) {
      this.viewMoreClick();
    }

  }
  onResize(event: any) {
    event.target.innerWidth;
    if (event.target.innerWidth < 992) {
      this.isMobile = true;
      this.isDesktop = false;
    }
    else {
      this.isDesktop = true;
    }
    
    setTimeout(() => {
      const header: any = document.querySelector('header')
      this.breadcrumbTop = `${header.offsetHeight}px`;
      this.cd.markForCheck();
    }, 500);
  }
  onPageRefresh() {
    this.isMobile = CommonUtils.isMobile();
    this.isTablet = CommonUtils.isTablet();
    this.isDesktop = CommonUtils.isDesktop();
  }

  // Check if any value is empty or undefined
  isNullOrEmpty(value: any): boolean {
    return value == null || value == undefined || value == "" || value == " ";
  }
}
