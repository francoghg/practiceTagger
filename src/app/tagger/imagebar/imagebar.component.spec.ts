import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagebarComponent } from './imagebar.component';

describe('ImagebarComponent', () => {
  let component: ImagebarComponent;
  let fixture: ComponentFixture<ImagebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
