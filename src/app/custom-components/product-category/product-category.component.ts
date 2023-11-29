import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { AccountDropdownStateService } from 'src/app/shared/services/account-dropdown-state.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
  navigationData: any[] = [];
  tilesData: any[] = [];
  productHeading: any;
  productDesc: any;
  showWaitCursor = new BehaviorSubject<boolean>(true); 
  breadcrumbData: any = [];
  navData:any;
  constructor(
    public acctDropService: AccountDropdownStateService,
    public cmsService: CmsService) { }

  ngOnInit(): void {
   this.navData = sessionStorage.getItem('productcategory');
   this.tilesData= JSON.parse(this.navData);
   
    this.breadcrumbData.push( { url: '/', name: 'Home' } , { url: '/', name: 'Products' } );
    this.cmsService.getComponentData('ProductPageTitleComponent').subscribe((data: any) => {
      if (data) {
        this.productHeading = data?.content;
        this.showWaitCursor.next(false);
      }
    })
    this.cmsService.getComponentData('ProductPageDescriptionComponent').subscribe((data: any) => {
      if (data) {
        this.productDesc = data?.content;
        this.showWaitCursor.next(false);
      }
    })
    this.cmsService.getCurrentPage().subscribe((ytList: any) => {

      if (ytList) {
        this.navigationData = [];
        let listItems = ytList.slots?.Section1?.components;
        if (listItems && listItems.length > 0)
          for (let i = 0; i < listItems.length; i++) {
            this.cmsService.getComponentData(listItems[i].uid).subscribe((data) => {
              if (data) {
                this.navigationData.push(data);
              }
            })
          }
      }
    })
  }
}
