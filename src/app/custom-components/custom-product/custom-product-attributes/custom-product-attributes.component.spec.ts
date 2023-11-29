import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProductAttributesComponent } from './custom-product-attributes.component';

describe('CustomProductAttributesComponent', () => {
  let component: CustomProductAttributesComponent;
  let fixture: ComponentFixture<CustomProductAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomProductAttributesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProductAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
