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
  ];
  

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.covid_analysis().subscribe(
      res => {this.resultData = res;
        this.barChartLabels =
           this.resultData.state
        
        this.barChartData.push({
          data: this.resultData.area, label: 'Avg Poupulation Density' 
        })
        this.barChartData.push({
          data: this.resultData.cases, label: 'Avg covid cases' ,type:'line',fill:false
        })
        
  this.showGraph = true;
      }
   );
  }

}
