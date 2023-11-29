import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCategoryComponent } from './custom-category.component';

describe('CustomCategoryComponent', () => {
  let component: CustomCategoryComponent;
  let fixture: ComponentFixture<CustomCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
