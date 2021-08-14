import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAnalisisComponent } from './main-analisis.component';

describe('MainAnalisisComponent', () => {
  let component: MainAnalisisComponent;
  let fixture: ComponentFixture<MainAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainAnalisisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
