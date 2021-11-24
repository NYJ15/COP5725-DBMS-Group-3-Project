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
  resultData = {};
  selectedMonth ="";
  months:  Month[] = [
    {id: '1', value: 'January'},
    {id: '2', value: 'February'},
    {id: '3', value: 'March'},
    {id: '4', value: 'April'},
    {id: '5', value: 'May'},
    {id: '6', value: 'June'},
  ];
  changeClient(event:any){
    console.log("Hi",event);
  }
  constructor(private query1dta : OracleQuery1ServiceService) { }

  ngOnInit(): void {
    this.query1dta.airline_mgmt().subscribe(
      res => this.resultData = res
   );
  }

}
