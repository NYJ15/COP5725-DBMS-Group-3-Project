import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFrequencyComponent } from './flight-frequency.component';

describe('FlightFrequencyComponent', () => {
  let component: FlightFrequencyComponent;
  let fixture: ComponentFixture<FlightFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
