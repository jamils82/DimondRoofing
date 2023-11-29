import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSocialFooterComponent } from './custom-social-footer.component';

describe('CustomSocialFooterComponent', () => {
  let component: CustomSocialFooterComponent;
  let fixture: ComponentFixture<CustomSocialFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomSocialFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSocialFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
