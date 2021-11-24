import { Injectable } from '@angular/core';
import { HttpClient } from'@angular/common/http';
import { HttpHeaders } from'@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OracleQuery1ServiceService {
  private query1 = "http://localhost:3000/url/";
  constructor(private httpClient: HttpClient) { }

  getData() { 
    console.log('Hi');
    return this.httpClient.get(this.query1); }

  getStates(){
    let query2 = "http://localhost:3000/states";
    return this.httpClient.get(query2); }
  

   
  postData() { 
    console.log('Hi');
    let query2 = "http://localhost:3000/send/";
    let body = {"month":2}
    return this.httpClient.post(query2, body,{headers: new HttpHeaders ().set('Content-Type','application/json')}); 
  }

  flight_freq(statename :string) { 
    console.log('Hi inside service');
    let query2 = "http://localhost:3000/flight-frequency/";
    let body = {"state":statename}
    return this.httpClient.post(query2, body,{headers: new HttpHeaders ().set('Content-Type','application/json')}); 
  }

  airline_mgmt() { 
    console.log('Hi');
    let query2 = "http://localhost:3000/airline-management/";
    let body = {"month":2}
    return this.httpClient.post(query2, body,{headers: new HttpHeaders ().set('Content-Type','application/json')}); 
  }

  airline_performance() { 
    console.log('Hi');
    let query2 = "http://localhost:3000/airline-performance/";
    let body = {"month":2}
    return this.httpClient.post(query2, body,{headers: new HttpHeaders ().set('Content-Type','application/json')}); 
  }

  covid_analysis() { 
    console.log('Hi');
    let query2 = "http://localhost:3000/covid-analysis/";
    let body = {"month":2}
    return this.httpClient.post(query2, body,{headers: new HttpHeaders ().set('Content-Type','application/json')}); 
  }

  covid_impact() { 
    console.log('Hi');
    let query2 = "http://localhost:3000/covid-impact/";
    let body = {"month":2}
    return this.httpClient.post(query2, body,{headers: new HttpHeaders ().set('Content-Type','application/json')}); 
  }




}
