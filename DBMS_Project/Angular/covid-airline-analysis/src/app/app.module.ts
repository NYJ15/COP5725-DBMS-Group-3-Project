import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts';
import { UsMapModule } from 'angular-us-map';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule, } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { CovidImpactComponent } from './covid-impact/covid-impact.component';
import { FlightFrequencyComponent } from './flight-frequency/flight-frequency.component';
import { AirlinePerformanceComponent } from './airline-performance/airline-performance.component';
import { AirlineManagementComponent } from './airline-management/airline-management.component';
import { CovidAnalysisComponent } from './covid-analysis/covid-analysis.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { ChartComponent } from './chart/chart.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CovidImpactComponent,
    FlightFrequencyComponent,
    AirlinePerformanceComponent,
    AirlineManagementComponent,
    CovidAnalysisComponent,
    ChartComponent
  ],
  exports:[MatDialogModule],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    UsMapModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
