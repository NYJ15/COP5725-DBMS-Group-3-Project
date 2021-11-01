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
}
