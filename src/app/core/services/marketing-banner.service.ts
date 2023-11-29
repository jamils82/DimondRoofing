import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class MarketBannersService {
  public _marketingbannerOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    sessionStorage.getItem("isShowBanner")?.toString().toLowerCase() == "false" ? false : true);

  public _marketingparagraphOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    sessionStorage.getItem("isShowParagraph")?.toString().toLowerCase() == "false" ? false : true);

  public setBannerState(bannerStatus: any): void {
    if (bannerStatus == 'banner') {
      this._marketingbannerOpened$.next(false);
      sessionStorage.setItem("isShowBanner", "false");
    }
    else {
      this._marketingparagraphOpened$.next(false);
      sessionStorage.setItem("isShowParagraph", "false");
    }
  }

}