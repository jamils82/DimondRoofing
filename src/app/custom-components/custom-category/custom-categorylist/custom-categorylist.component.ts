import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-custom-categorylist',
  templateUrl: './custom-categorylist.component.html',
  styleUrls: ['./custom-categorylist.component.scss']
})
export class CustomCategorylistComponent implements OnInit {
  @Input() categoriesData: any = [];
  @Input() clpPage: boolean = false;
  storeFrontUrl = environment.UIsiteURl;
  rootCategory: any = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    const cat = window.location.search.split('=').pop();
    if (cat != undefined && cat != '')
      this.rootCategory = '?rootCategory=' + cat;
  }
  getImageListview(data: any) {
    let imageUrl;
    imageUrl = data?.images?.filter(
      (img: any) => img.format == "product"
    );
    return imageUrl;
  }
}
