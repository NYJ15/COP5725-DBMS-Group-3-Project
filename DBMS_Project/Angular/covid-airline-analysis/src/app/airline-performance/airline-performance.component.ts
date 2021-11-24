import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

@Component({
  selector: 'app-airline-performance',
  templateUrl: './airline-performance.component.html',
  styleUrls: ['./airline-performance.component.scss']
})
export class AirlinePerformanceComponent implements OnInit {

  resultData:any;
  showGraph:boolean = false;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['January', 'Februrary', 'March', 'April', 'May', 'June'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartData:any = [
  ];

  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.airline_performance().subscribe(
      res => {this.resultData = res;
        Object.keys(this.resultData).forEach(key => {
   
          this.barChartData.push({
            data: this.resultData[key], label: key
          })
      
  });
  this.showGraph = true;
      }
     
   );
  }

}
