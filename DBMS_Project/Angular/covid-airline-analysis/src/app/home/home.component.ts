import { Component, OnInit } from '@angular/core';
import { ChartDataSets,ChartType, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import *  as d3 from 'd3';
import firstmodulepackage from '../../assets/gz_2010_us_040_00_5m.json';
import usamap from '../../assets/usa.json';
import {OracleQuery1ServiceService } from '../oracle-query1-service.service';
import { __await } from 'tslib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // this contains the result rows of our query.
 resultData = {};
   constructor(private query1dta : OracleQuery1ServiceService) { }

    // make sure to reference the correct structure
 firstModelData = firstmodulepackage.features;
 setMap(width: any, height:any, dataset: any) {
  const margin = {top: 100, right: 300, bottom: 100, left: 300};
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;
  const projection = d3.geoMercator()
                    .rotate([-11, 0])
                    .scale(1)
                    .translate([0, 0]);
  const path = d3.geoPath().projection(projection);
  const svg = d3.select('.world-map')
               .append('svg')
               .attr('viewBox', '0 0 1000 600')
               .attr('preserveAspectRatio', 'xMidYMid')
               .style('max-width', 1200)
               .style('margin', 'auto')
               .style('display', 'flex');

  svg.select("svg").selectAll('path')
    .data(dataset)
    .enter()
    .append('path')
    .attr('d', <any> path)
    .attr("class", "world-map");
}
 
   public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions & { annotation ?: any }) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  ngOnInit(): void {
    // console.log(this.firstModelData)
    console.log(this.firstModelData);
    this.setMap(1000, 600, this.firstModelData);
    this.query1dta.getData().subscribe(
      res => this.resultData = res
   );
  }

}
