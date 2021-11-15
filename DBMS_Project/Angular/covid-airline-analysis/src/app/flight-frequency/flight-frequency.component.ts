import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

@Component({
  selector: 'app-flight-frequency',
  templateUrl: './flight-frequency.component.html',
  styleUrls: ['./flight-frequency.component.scss']
})
export class FlightFrequencyComponent implements OnInit {
  resultData = {};

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.flight_freq().subscribe(
      res => this.resultData = res
   );
  }

}
