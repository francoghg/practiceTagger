import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageClusteringComponent } from './image-clustering.component';

describe('ImageClusteringComponent', () => {
  let component: ImageClusteringComponent;
  let fixture: ComponentFixture<ImageClusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageClusteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
