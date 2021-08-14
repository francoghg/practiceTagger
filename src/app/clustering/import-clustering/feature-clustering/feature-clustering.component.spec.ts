import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureClusteringComponent } from './feature-clustering.component';

describe('FeatureClusteringComponent', () => {
  let component: FeatureClusteringComponent;
  let fixture: ComponentFixture<FeatureClusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureClusteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
