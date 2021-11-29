import { Component, OnInit } from '@angular/core';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';

interface Month {
  id: string;
  value: string;
}
interface Year {
  id: string;
  value: string;
}
@Component({
  selector: 'app-covid-analysis',
  templateUrl: './covid-analysis.component.html',
  styleUrls: ['./covid-analysis.component.scss']
})
export class CovidAnalysisComponent implements OnInit {
  resultData:any;
  selectedMonth ="";
  selectedYear="";
  showGraph:boolean = false;
  showMonth:boolean = false;
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
  months:  Month[] = [
    {id: '1', value: 'January'},
    {id: '2', value: 'February'},
    {id: '3', value: 'March'},
    {id: '4', value: 'April'},
    {id: '5', value: 'May'},
    {id: '6', value: 'June'},
    {id: '1', value: 'July'},
    {id: '2', value: 'August'},
    {id: '3', value: 'September'},
    {id: '4', value: 'October'},
    {id: '5', value: 'November'},
    {id: '6', value: 'December'}
  ];
  years:  Year[] = [
    {id: '2021', value: '2021'},
    {id: '2020', value: '2020'}
  ];
  rgbColor:any[] = ['#FF6666','#1434A4'];
  ct=0;
  constructor(private query1dta : OracleQuery1ServiceService) { }
  changeClient(event:any){
    if(this.selectedYear.length > 0){
      this.showMonth = true
    }
    if(this.selectedYear.length > 0 && this.selectedMonth.length > 0 ){
      this.resultData ={};
    let body:any={
      year:this.selectedYear,
      month: this.selectedMonth
    }
    this.barChartData =[];
    this.query1dta.covid_analysis(body).subscribe(
      res => {this.resultData = res;
        this.barChartLabels =
           this.resultData.state
        this.barChartData.push({
          data: this.resultData.cases, label: 'Average Covid Cases' ,type:'line',borderColor: this.rgbColor[1],fill:false
        })
        this.barChartData.push({
          data: this.resultData.area, label: 'Average Population Density' ,backgroundColor: this.rgbColor[0]
        })

  this.showGraph = true;
      }
   );
    }

  }
  ngOnInit(): void {
  }

}
