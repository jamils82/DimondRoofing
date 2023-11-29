import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-product-attributes',
  templateUrl: './custom-product-attributes.component.html',
  styleUrls: ['./custom-product-attributes.component.scss']
})
export class CustomProductAttributesComponent implements OnInit {

  @Input() productAttributes: any;

  constructor() { }

  ngOnInit(): void {
  }

}
