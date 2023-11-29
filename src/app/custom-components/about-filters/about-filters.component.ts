import { Component, OnInit } from '@angular/core';
import { CmsService, User } from '@spartacus/core';

@Component({
  selector: 'app-about-filters',
  templateUrl: './about-filters.component.html',
  styleUrls: ['./about-filters.component.scss'],
})
export class AboutFiltersComponent implements OnInit {
  pageTitle: any;

  constructor(public cmsService: CmsService) {}

  ngOnInit(): void {
    // function to get page title
    this.cmsService.getCurrentPage().subscribe((pagadata: any) => {
      this.pageTitle = pagadata?.title;
    });
  }
}
