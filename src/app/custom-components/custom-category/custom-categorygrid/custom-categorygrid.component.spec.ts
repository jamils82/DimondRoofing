import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCategorygridComponent } from './custom-categorygrid.component';

describe('CustomCategorygridComponent', () => {
  let component: CustomCategorygridComponent;
  let fixture: ComponentFixture<CustomCategorygridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCategorygridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCategorygridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
