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
    responsive: true,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Months',
          
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Number of Flight Cancellations',
          
        }
      }]
    }   
  };
  public barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartData:any = [
  ];
  rgbColor:any[] = ['#4300CE','#8300D2','#0500CA','#0FCE00','#d0e1ad','#D3D900','#DDA000','#E16000','#E51C00','#000000']
  ct = 0;
  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.airline_performance().subscribe(
      res => {this.resultData = res;
        this.barChartData.push({data: this.resultData.case, label: 'Covid-19 Cases',fill:false, type:"line"})
        Object.keys(this.resultData).forEach(key => {
          if(key!="case"){
            this.barChartData.push({
              data: this.resultData[key], label: key,backgroundColor: this.rgbColor[this.ct]
            })
          }
      this.ct = this.ct +1;
  });
  this.showGraph = true;
      }
   );
  }

}
