import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAnalisisComponent } from './export-analisis.component';

describe('ExportAnalisisComponent', () => {
  let component: ExportAnalisisComponent;
  let fixture: ComponentFixture<ExportAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportAnalisisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
