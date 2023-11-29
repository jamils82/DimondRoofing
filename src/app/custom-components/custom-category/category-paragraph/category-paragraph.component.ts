import { Component, OnInit } from '@angular/core';
import { CmsService } from '@spartacus/core';

@Component({
  selector: 'app-category-paragraph',
  templateUrl: './category-paragraph.component.html',
  styleUrls: ['./category-paragraph.component.scss']
})
export class CategoryParagraphComponent implements OnInit {
  categoryParagraph: any;
  pageTemplateName: any;
  constructor(
    private cmsService: CmsService,
  ) { }

  ngOnInit(): void {
    this.cmsService.getCurrentPage().subscribe((data: any) => {
      this.pageTemplateName = data.template;
      if (this.pageTemplateName == 'CategoryGridPageTemplate') {
        this.cmsService.getComponentData("CategoryPageParagraphComponent").subscribe(data => {
          this.categoryParagraph = data;
        })
      } else if (this.pageTemplateName == 'ProductGridPageTemplate' || this.pageTemplateName == 'SearchResultsGridPageTemplate') {
        this.cmsService.getComponentData("CategoryPageParagraphComponent").subscribe(data => {
          this.categoryParagraph = data;
        })
      }
    })

  }

}
