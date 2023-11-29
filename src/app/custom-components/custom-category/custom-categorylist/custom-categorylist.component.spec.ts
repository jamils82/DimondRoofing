import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCategorylistComponent } from './custom-categorylist.component';

describe('CustomCategorylistComponent', () => {
  let component: CustomCategorylistComponent;
  let fixture: ComponentFixture<CustomCategorylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCategorylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCategorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
