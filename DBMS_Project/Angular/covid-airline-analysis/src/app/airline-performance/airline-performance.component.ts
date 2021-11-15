import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

@Component({
  selector: 'app-airline-performance',
  templateUrl: './airline-performance.component.html',
  styleUrls: ['./airline-performance.component.scss']
})
export class AirlinePerformanceComponent implements OnInit {

  resultData = {};

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.airline_performance().subscribe(
      res => this.resultData = res
   );
  }

}
