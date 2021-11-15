import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlinePerformanceComponent } from './airline-performance.component';

describe('AirlinePerformanceComponent', () => {
  let component: AirlinePerformanceComponent;
  let fixture: ComponentFixture<AirlinePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirlinePerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlinePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
