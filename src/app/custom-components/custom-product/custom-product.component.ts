import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/core/config/utils/utils';
import { GET_PRODUCT_SEARCH } from 'src/app/core/services/endPointURL';
import { CustomSearchService } from 'src/app/core/services/search.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-custom-product',
  templateUrl: './custom-product.component.html',
  styleUrls: ['./custom-product.component.scss']
})
export class CustomProductComponent implements OnInit {
  listview: boolean = true;
  loaderImage = new BehaviorSubject<boolean>(false);
  showWaitCursor = new BehaviorSubject<boolean>(false);
  isMobile = false;
  isTablet = false;
  isDesktop = true;;
  prodSubcription = new Subscription();
  breadcrumbData: any = [];
  isDataLoaded: boolean = false;
  listArray: any[] = [];
  productData: any[] = [];
  facetsData: any = [];
  facetsValues: string = '';
  token: any;
  currentPage = 0;
  pageSize: number = 12;
  freeTextSearch: any;
  model: any;
  query: any;
  categoryCode: any;
  totalResults: any;
  searchText: any;
  selectedNames: any = [];
  showSelectedFilters: boolean = true;
  islandName: string = '';

  @ViewChild('filterModal') facetPopup: any;
  constructor(
    private searchService: CustomSearchService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    public http: HttpClient
  ) { }
  ngOnInit(): void {
    this.onPageRefresh();
    const code: any = localStorage.getItem('branchDetails');
    this.categoryCode = JSON.parse(code)?.categoryCode;
    this.islandName = JSON.parse(code)?.islandName;
    this.query = this.route.snapshot.params['query'];
    // const locString: any = localStorage.getItem('spartacus⚿⚿auth');
    // this.token = JSON.parse(locString)?.token.access_token;
    this.searcRresultData();
  }
  searcRresultData() {
    this.showWaitCursor.next(true);
    if (this.facetsValues == '') { 
      this.query = this.query + ':relevance:' + 'island:' + this.categoryCode; 
    }
    this.searchService.getSearchResultsData(this.query, this.categoryCode, this.currentPage, this.facetsValues).subscribe((prodModel: any) => {
      this.isDataLoaded = true;
      this.model = prodModel;
      this.listArray = prodModel?.products;
      this.freeTextSearch = prodModel?.freeTextSearch;
      this.totalResults = prodModel?.pagination?.totalResults;
      this.breadcrumbData = [];
      this.breadcrumbData.push({ url: '/', name: 'Home' });
      this.searchText = "Search results for '" + prodModel?.freeTextSearch + "'";
      this.breadcrumbData.push({ name: this.searchText, url: '' });
      this.facetsData = prodModel?.facets;
      this.productData = this.listArray;
      this.getSelectedFacetsNames();
      this.cd.markForCheck();
      this.showWaitCursor.next(false);
    })
  }
  viewMoreClick() {
    this.loaderImage.next(true);
    setTimeout(() => {
      this.currentPage += 1;
    this.searchService.getSearchResultsData(this.query, this.categoryCode, this.currentPage, this.facetsValues).subscribe((data: any) => {
      data?.products.forEach((element: any) => {
        this.productData = [...this.productData, element];
      });
      this.totalResults = data?.pagination?.totalResults;
      this.cd.markForCheck();
      this.loaderImage.next(false);
    })
    }, 2000);
  }
  onScroll() {
    if (this.totalResults > this.productData.length) {
      this.viewMoreClick();
    }

  }

  getSelectedFacets(selectedFacets: any) {
    if (selectedFacets) {
      this.facetsValues = selectedFacets.value;
      this.showWaitCursor.next(true);
      this.getApiRespose();
    } else {
      const code: any = localStorage.getItem('branchDetails');
      this.categoryCode = JSON.parse(code)?.categoryCode;
      this.query = this.route.snapshot.params['query'] + ':relevance:' + 'island:' + this.categoryCode;
      // const locString: any = localStorage.getItem('spartacus⚿⚿auth');
      // this.token = JSON.parse(locString)?.token.access_token;
      this.searcRresultData();
    }
 

  }
  getApiRespose() {
    this.currentPage = 0;
    this.searchService.getSearchResultsData(this.facetsValues, this.categoryCode, this.currentPage, this.pageSize).subscribe((data: any) => {
    // this.http.get(url).subscribe((data: any) => {
      if (data) {
        this.model = data;
        this.productData = data?.products;
        this.totalResults = data?.pagination?.totalResults;
        this.facetsData = data?.facets;
        this.isDataLoaded = true;
        this.getSelectedFacetsNames();
        this.showWaitCursor.next(false);
      }
    }, error => {
      this.showWaitCursor.next(false);
    })
  }
  
  mobileFacetsClose() {
    this.facetPopup.nativeElement.click();
  }
  gridView() {
    this.listview = false;
  }
  listView() {
    this.listview = true;
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
  onResize(event: any) {
    event.target.innerWidth;
    if (event.target.innerWidth < 768) {
      this.isMobile = true;
      this.isDesktop = false;
      
    }
    else if (event.target.innerWidth< 992) {
      this.isTablet = true;
      this.isDesktop = false;
    }
    else {
      this.isDesktop = true;
    }
  }
  onPageRefresh() {
    this.isMobile = CommonUtils.isMobile();
    this.isTablet = CommonUtils.isTablet();
    this.isDesktop = CommonUtils.isDesktop();
  }
}
