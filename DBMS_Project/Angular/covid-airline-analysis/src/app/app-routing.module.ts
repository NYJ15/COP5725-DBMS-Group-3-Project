import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirlineManagementComponent } from './airline-management/airline-management.component';
import { AirlinePerformanceComponent } from './airline-performance/airline-performance.component';
import { CovidAnalysisComponent } from './covid-analysis/covid-analysis.component';
import { CovidImpactComponent } from './covid-impact/covid-impact.component';
import { FlightFrequencyComponent } from './flight-frequency/flight-frequency.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'airline-management', component: AirlineManagementComponent },
  { path: 'airline-performance', component: AirlinePerformanceComponent },
  { path: 'covid-analysis', component: CovidAnalysisComponent },
  { path: 'covid-impact', component: CovidImpactComponent },
  { path: 'flight-frequency', component: FlightFrequencyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
