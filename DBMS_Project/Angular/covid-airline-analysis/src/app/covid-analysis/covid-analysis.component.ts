import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

@Component({
  selector: 'app-covid-analysis',
  templateUrl: './covid-analysis.component.html',
  styleUrls: ['./covid-analysis.component.scss']
})
export class CovidAnalysisComponent implements OnInit {
  resultData:any;
  showGraph:boolean = false;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:any = [];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  cases: any=[];
  public barChartData:any = [
    {
      data: this.cases, label: 'Population density' ,type:'line'
    }
  ];
  

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.covid_analysis().subscribe(
      res => {this.resultData = res;
        Object.keys(this.resultData).forEach(key => {
          this.barChartLabels.push(key)
          this.barChartData.push({
            data: this.resultData[key][0], label: 'Population density'
          });
          this.cases.push(this.resultData[key][1])
      
  });
  
  this.showGraph = true;
      }
   );
  }

}
