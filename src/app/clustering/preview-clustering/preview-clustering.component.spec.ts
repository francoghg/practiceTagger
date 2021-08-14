import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewClusteringComponent } from './preview-clustering.component';

describe('PreviewClusteringComponent', () => {
  let component: PreviewClusteringComponent;
  let fixture: ComponentFixture<PreviewClusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewClusteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
