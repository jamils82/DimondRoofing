import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryParagraphComponent } from './category-paragraph.component';

describe('CategoryParagraphComponent', () => {
  let component: CategoryParagraphComponent;
  let fixture: ComponentFixture<CategoryParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryParagraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
