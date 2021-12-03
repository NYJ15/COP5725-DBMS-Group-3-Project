import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

@Component({
  selector: 'app-covid-impact',
  templateUrl: './covid-impact.component.html',
  styleUrls: ['./covid-impact.component.scss']
})
export class CovidImpactComponent implements OnInit {
  resultData:any;
  showGraph: boolean=false;
  selectedMonth ="";
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Dates',
          
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Traveler Throughput / Covid-19 Cases / Covid-19 Vaccinations',
          
        }
      }]
    } 
  };
  public barChartLabels = ['Jan 19', 'Feb 19', 'Mar 19', 'Apr 19', 'May 19', 'Jun 19','Jul 19','Aug 19','Sept 19','Oct 19','Nov 19','Dec 19','Jan 20', 'Feb 20', 'Mar 20', 'Apr 20', 'May 20', 'Jun 20','Jul 20','Aug 20','Sept 20','Oct 20','Nov 20','Dec 20','Jan 21', 'Feb 21', 'Mar 21', 'Apr 21', 'May 21', 'Jun 21','Jul 21','Aug 21','Sept 21','Oct 21'];
  public barChartType: any = 'line';
  public barChartLegend = true;
  public barChartData:any = [
  ];

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.covid_impact().subscribe(
      res => {
        this.resultData = res;
        this.barChartData = [
          {data: this.resultData.flight, label: 'Traveler Throughput', fill:false},
          {data: this.resultData.cases, label: 'Covid-19 Cases',fill:false},
          {data: this.resultData.vaccine, label: 'Covid-19 Vaccines',fill:false}
        ];
        this.showGraph = true;
      }
   );
  }

}
