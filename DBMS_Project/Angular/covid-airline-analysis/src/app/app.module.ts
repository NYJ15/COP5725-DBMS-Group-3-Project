import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts';
import { UsMapModule } from 'angular-us-map';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CovidImpactComponent } from './covid-impact/covid-impact.component';
import { FlightFrequencyComponent } from './flight-frequency/flight-frequency.component';
import { AirlinePerformanceComponent } from './airline-performance/airline-performance.component';
import { AirlineManagementComponent } from './airline-management/airline-management.component';
import { CovidAnalysisComponent } from './covid-analysis/covid-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CovidImpactComponent,
    FlightFrequencyComponent,
    AirlinePerformanceComponent,
    AirlineManagementComponent,
    CovidAnalysisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    UsMapModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
