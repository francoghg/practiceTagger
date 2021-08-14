import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainClusteringComponent } from './main-clustering.component';

describe('MainClusteringComponent', () => {
  let component: MainClusteringComponent;
  let fixture: ComponentFixture<MainClusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainClusteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});