import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';
import { BehaviorSubject } from 'rxjs';
import { newsAndUpdates } from 'src/app/core/constants/general';

@Component({
  selector: 'app-shared-news-updates',
  templateUrl: './shared-news-updates.component.html',
  styleUrls: ['./shared-news-updates.component.scss']
})
export class SharedNewsUpdatesComponent implements OnInit {

  newsFeedData: any[] = [];
  public siteLink = '';
  public siteLinkName = '';
  public siteLinkTarget = '';
  title: string = '';
  alreadySubscribed: boolean = false;
  showWaitCursor = new BehaviorSubject<boolean>(false);
  constantsData = new newsAndUpdates(); 
  constructor(
    private cmsService: CmsService) { }

  ngOnInit(): void {
    this.showWaitCursor.next(true);
    this.cmsService.getComponentData('BPCMSNewsComponent').subscribe((data: any) => {
      if (data && !this.alreadySubscribed) {
        this.alreadySubscribed = true;
        let listItems = data.bpContentBannerComponent.split(' ');
        this.siteLink = data.link.url;
        this.siteLinkName = data.link.name;
        this.siteLinkTarget = data.link.target;
        this.title = data.title;

        if (listItems) {
          for (let i = 0; i < listItems.length; i++) {
            this.cmsService.getComponentData(listItems[i]).subscribe((data) => {
              if (data) {
                this.newsFeedData.push(data);
                if (listItems.length == this.newsFeedData.length)
                  this.showWaitCursor.next(false);
              }
            })
          }
        }
      }
    } , (error) => {
      this.showWaitCursor.next(false);
    })
  }

}
