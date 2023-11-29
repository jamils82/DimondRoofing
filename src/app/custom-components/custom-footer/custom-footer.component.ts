import { Component, OnInit } from '@angular/core';
import { CmsService, CmsNavigationComponent } from '@spartacus/core';
import { CmsComponentData, NavigationService, FooterNavigationComponent } from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { CommonUtils } from 'src/app/core/config/utils/utils';

@Component({
  selector: 'app-custom-footer',
  templateUrl: './custom-footer.component.html',
  styleUrls: ['./custom-footer.component.scss']
})
export class CustomFooterComponent extends FooterNavigationComponent implements OnInit {

  showWaitCursor = new BehaviorSubject<boolean>(true);
  constructor(private cmsService: CmsService, componentData: CmsComponentData<CmsNavigationComponent>, service: NavigationService,) {
    super(componentData, service);
  }

  footerData: any;
  uidd: any;
  logo: any = {};
  logoData = new BehaviorSubject<any>({});
  footerLinkArray: any = [];
  AllComponentArray: any = [];
  AllClientLogo: any = [];
  ForAssistanceTxt: any = [];
  NereastBranchTxt: any = [];
  isDataLoaded: boolean = false;
  copyRightTxt:any;
  isMobile = false;
  ngOnInit(): void {
    this.onPageRefresh();
    this.showWaitCursor.next(false);
    // this.node$.subscribe((nodeData: any) => {
    //   this.showWaitCursor.next(true);
    //   this.footerLinkArray = nodeData.children[1].children;
    //   this.showWaitCursor.next(false);
    // });

    // this.cmsService.getComponentData(this.componentData.uid.toString()).subscribe(data => {
    //   this.showWaitCursor.next(true);
    //   this.footerData = data;
    //   this.uidd = this.footerData?.navigationNode.uid.toString();

    //   this.cmsService.getNavigationEntryItems(this.uidd).subscribe(AllUidData => {
    //     if (AllUidData) {
    //       this.AllComponentArray = { ...AllUidData };
    //       this.ForAssistanceTxt = this.AllComponentArray['FooterAssistanceParagraphComponent_AbstractCMSComponent'];
    //       this.NereastBranchTxt = this.AllComponentArray['FooterSalesParagraphComponent_AbstractCMSComponent'];

    //       this.AllComponentArray = Object.keys(AllUidData).map(key => ({ type: key, value: AllUidData[key] }));
    //       if( !this.isDataLoaded )
    //       for (var i = 0; i < this.AllComponentArray.length; i++) {
    //         if (this.AllComponentArray[i].value.media && this.AllComponentArray[i].value.uid != 'FooterSitelogoComponent') {
    //           this.isDataLoaded = true;
    //           this.AllClientLogo.push(this.AllComponentArray[i]);
    //         }
    //       }
    //     } 
    //   })
    //   this.showWaitCursor.next(false);
    // })
    // this.cmsService.getComponentData("FooterSitelogoComponent").subscribe((data: any) => {
    //   this.logo = data;
    //   this.logoData.next(data?.media);
    // })

  }

  getSortedData(data: any): any {
    const sortedData = data;
    sortedData?.sort((a: any, b: any) => {
      if (a?.value?.media?.code < b?.value?.media?.code) {
        return -1;
      }
      if (a?.value?.media?.code > b?.value?.media?.code) {
        return 1;
      }
      return 0;
    }); //sort brand wise in alphabetical order

    return sortedData;
  }
  onResize(event: any) {
    event.target.innerWidth;
    if (event.target.innerWidth < 768) {
      this.isMobile = true;
    }
    else{
      this.isMobile = false;
    }
  }

  onPageRefresh() {
    this.isMobile = CommonUtils.isMobile();
  }
}
