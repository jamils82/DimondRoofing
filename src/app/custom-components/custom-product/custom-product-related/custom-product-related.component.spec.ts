import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProductRelatedComponent } from './custom-product-related.component';

describe('CustomProductRelatedComponent', () => {
  let component: CustomProductRelatedComponent;
  let fixture: ComponentFixture<CustomProductRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomProductRelatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProductRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
