import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';
import { ChartDataSets,ChartType, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {Observable} from 'rxjs';
import {isEmpty, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-flight-frequency',
  templateUrl: './flight-frequency.component.html',
  styleUrls: ['./flight-frequency.component.scss']
})
export class FlightFrequencyComponent implements OnInit {
  resultData:{[k: string]:any} = {};
  staename: string = '';
  street: string = '';
  control = new FormControl();
  streets: string[] = ["California","Tennessee","Rhode Island","Montana","Texas","Oregon","Kansas","Arizona","Virginia","South Dakota","New York","Pennsylvania","Washington","Wisconsin","Minnesota","Massachusetts","South Carolina","Iowa","Connecticut","West Virginia","Arkansas","Hawaii","Nevada","Wyoming","Michigan","Ohio","Idaho","North Carolina","Illinois","Colorado","District of Columbia","U.S. Virgin Islands","Florida","Georgia","Louisiana","Kentucky","Oklahoma","Alabama","Alaska","New Mexico","North Dakota","New Hampshire","New Jersey","Maryland","Delaware","Utah","Indiana","Missouri","Mississippi","Nebraska","Puerto Rico","Maine","Vermont"];
  filteredStreets: Observable<string[]>;
  public showGraph:boolean = false;
  constructor(private query1dta : OracleQuery1ServiceService) { }

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
          labelString: 'Number of Covid-19 Cases / Flights',
          
        }
      }]
    }     
  };
  flight:any = [];
  cases:any= [];
  MONTH= [];
  public barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartData:any;

  ngOnInit(): void {
   this.filteredStreets = this.control.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value)),
  );

  }
  onSelFunc(event: any){
    console.log("In click",event.option.value);
    this.query1dta.flight_freq(event.option.value).subscribe(
      res => {
        this.resultData = res;
        this.barChartData = [
          {data: this.resultData.flight, label: 'Number of Flights'},
          {data: this.resultData.cases, label: 'Number of Covid-19 cases', type: 'line'}
        ];
       this.showGraph = true;}
    );


  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.streets.filter(street => this._normalizeValue(street).includes(filterValue));
  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

}
