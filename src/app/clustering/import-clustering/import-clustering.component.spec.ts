import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportClusteringComponent } from './import-clustering.component';

describe('ImportClusteringComponent', () => {
  let component: ImportClusteringComponent;
  let fixture: ComponentFixture<ImportClusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportClusteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
