import { Component, OnInit } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

interface Month {
  id: string;
  value: string;
}
@Component({
  selector: 'app-airline-management',
  templateUrl: './airline-management.component.html',
  styleUrls: ['./airline-management.component.scss']
})
export class AirlineManagementComponent implements OnInit {
  resultData:any;
  showGraph: boolean=false;
  selectedMonth ="";
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['0', '1', '2', '3', '4', '5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
  public barChartType: any = 'line';
  public barChartLegend = true;
  public barChartData:any = [
  ];
  rgbColor:any [] = [ 'rgb(75, 192, 192)','rgb(75, 0, 130)','rgb(70, 0, 255)','rgb(0, 0, 255)','rgb(255, 255, 0)']
  months:  Month[] = [
    {id: '1', value: 'January'},
    {id: '2', value: 'February'},
    {id: '3', value: 'March'},
    {id: '4', value: 'April'},
    {id: '5', value: 'May'},
    {id: '6', value: 'June'},
  ];
 ct=0;
  changeClient(event:any){
    console.log("Hi",event.value);
    this.resultData ={};
    this.barChartData =[]
    this.ct = 0;
    this.query1dta.airline_mgmt(event.value).subscribe(
      res => {
        this.resultData = res;
        Object.keys(this.resultData).forEach(key => {
   
          this.barChartData.push({
            data: this.resultData[key], label: key, fill:false,  borderColor: this.rgbColor[this.ct],
          })
      this.ct = this.ct +1
  });
        this.showGraph = true;
      }
   );
  }
  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
   
  }

}
