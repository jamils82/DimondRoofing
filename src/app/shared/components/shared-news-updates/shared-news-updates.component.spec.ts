import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNewsUpdatesComponent } from './shared-news-updates.component';

describe('SharedNewsUpdatesComponent', () => {
  let component: SharedNewsUpdatesComponent;
  let fixture: ComponentFixture<SharedNewsUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedNewsUpdatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedNewsUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
