import { Component } from '@angular/core';
import {OracleQuery1ServiceService } from './oracle-query1-service.service';
import { HomeComponent } from '../app/home/home.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(){}
  title = 'covid-airline-analysis';
}
