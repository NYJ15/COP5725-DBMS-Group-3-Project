import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

@Component({
  selector: 'app-covid-analysis',
  templateUrl: './covid-analysis.component.html',
  styleUrls: ['./covid-analysis.component.scss']
})
export class CovidAnalysisComponent implements OnInit {
  resultData = {};

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.covid_analysis().subscribe(
      res => this.resultData = res
   );
  }

}
