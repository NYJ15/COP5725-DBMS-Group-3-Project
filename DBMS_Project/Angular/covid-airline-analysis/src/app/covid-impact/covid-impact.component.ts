import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

@Component({
  selector: 'app-covid-impact',
  templateUrl: './covid-impact.component.html',
  styleUrls: ['./covid-impact.component.scss']
})
export class CovidImpactComponent implements OnInit {
  resultData = {};

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.covid_impact().subscribe(
      res => this.resultData = res
   );
  }

}
