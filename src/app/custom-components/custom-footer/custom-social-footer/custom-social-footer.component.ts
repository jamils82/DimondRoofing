import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-custom-social-footer',
  templateUrl: './custom-social-footer.component.html',
  styleUrls: ['./custom-social-footer.component.scss']
})
export class CustomSocialFooterComponent implements OnInit {
  socialLinks: any[] = [];
  alreadySubscribed: boolean = false;
  listItem: any = [];
  localArray: any = [];

  showWaitCursor = new BehaviorSubject<boolean>(true);
  constructor(private cmsService: CmsService) { }

  ngOnInit(): void {
    this.cmsService.getComponentData('MediaLinksComponent').subscribe((data: any) => {
      this.showWaitCursor.next(true);
      this.listItem = data.bannerComponents.split(' ');
      if (this.listItem) {
        for (let i = 0; i < this.listItem.length; i++) {
          this.cmsService.getComponentData(this.listItem[i]).subscribe((data: any) => {
            if (data && (this.listItem.length != this.socialLinks.length)) {
              const indexOf = this.socialLinks.findIndex((element: any) => element == data)
              if (indexOf < 0)
                this.socialLinks.push(data)
            }
          })
        }
      }
      this.showWaitCursor.next(false);
    })
  }
}
