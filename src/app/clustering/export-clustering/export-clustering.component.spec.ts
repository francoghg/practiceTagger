import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportClusteringComponent } from './export-clustering.component';

describe('ExportClusteringComponent', () => {
  let component: ExportClusteringComponent;
  let fixture: ComponentFixture<ExportClusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportClusteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
