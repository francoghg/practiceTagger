import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileClusteringComponent } from './file-clustering.component';

describe('FileClusteringComponent', () => {
  let component: FileClusteringComponent;
  let fixture: ComponentFixture<FileClusteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileClusteringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileClusteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
