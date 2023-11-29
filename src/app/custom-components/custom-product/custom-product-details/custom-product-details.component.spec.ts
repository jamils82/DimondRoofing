import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProductDetailsComponent } from './custom-product-details.component';

describe('CustomProductDetailsComponent', () => {
  let component: CustomProductDetailsComponent;
  let fixture: ComponentFixture<CustomProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
