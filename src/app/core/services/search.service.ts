import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from "@angular/common/http";
import { GET_PRODUCT_SEARCH, GET_PRODUCT_DETAILS } from './endPointURL';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomSearchService {

  constructor(private http: HttpClient) { }

  getProductSearchResults(query:any, categoryCode?:any) {
    let params = new HttpParams();
    let apiURL = GET_PRODUCT_SEARCH.url;
    params = params.set("fields", 'products(bpAdditionalAttribute,code,name,summary,configurable,configuratorType,multidimensional,price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions,description),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery');
    //params = params.set("fields", 'products(FULL),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),contents(FULL),freeTextSearch');
    params = params.set("query", query)
    params = params.set("island", categoryCode)
    //params = params.set("pageSize", '5')
    params = params.set("term", query)
    return this.http.get<any>(apiURL, { params: params });
  }

  getSearchResultsData(query?:any, categoryCode?:any, currentPage?: any, ...facetsValues:any): Observable<any> {
    let params = new HttpParams();
    let apiURL = GET_PRODUCT_SEARCH.url;
    params = params.set("fields", 'products(bpAdditionalAttribute,code,name,summary,configurable,configuratorType,multidimensional,price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions,description),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery');
    params = params.set("query", query+'')
    params = params.set("island", categoryCode)
    params = params.set("currentPage", currentPage)
    params = params.set("facets", facetsValues)
    params = params.set("pageSize", '20')
    params = params.set("term", query)
    return this.http.get(apiURL,{ params: params } ) as Observable<any>;
  }
  getProductsData(categoryName?:any, categoryCode?:any, currentPage?:any, rootCategory?:any): Observable<any> {
    let params = new HttpParams();
    let apiURL = GET_PRODUCT_SEARCH.url;
    params = params.set("fields", 'products(bpAdditionalAttribute,code,name,summary,configurable,configuratorType,multidimensional,price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions,description),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch,currentQuery');
    params = params.set("query", categoryName)
    params = params.set("island", categoryCode)
    params = params.set("currentPage", currentPage)
    params = params.set("pageSize", '20')
    params = params.set("rootCategory", rootCategory)
   // params = params.set("term", query)
    return this.http.get(apiURL,{ params: params } ) as Observable<any>;
  }

  getProductDetailsResults(productCode?:any) {
    let params = new HttpParams();
    let apiURL = GET_PRODUCT_DETAILS(productCode).url;
    return this.http.get<any>(apiURL);
  }
}
