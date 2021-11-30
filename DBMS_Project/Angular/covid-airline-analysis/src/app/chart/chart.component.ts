import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { OracleQuery1ServiceService } from '../oracle-query1-service.service';
import { isPlatformBrowser } from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
import {Router} from '@angular/router';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { json } from 'd3-fetch';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';

// am4core.useTheme(am4themes_kelly);
// am4core.useTheme(am4themes_animated);


// import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  resultData: any;
  resultDatas: any;
  private chart: am4charts.XYChart;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private zone: NgZone, private query1dta: OracleQuery1ServiceService, public dialog: MatDialog,
   private route:Router) { }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {

    this.query1dta.getCharts().subscribe(
      res => {
        this.resultData = res;
        this.resultDatas = []
        for (let item of this.resultData['rows']) {
          this.resultDatas.push({
            id: 'US-' + item[0],
            value: item[1],
            total_cases: item[1],
            total_vaccinations: item[2],
            population_density: item[3]
          });
        }
        this.browserOnly(() => {
          am4core.useTheme(am4themes_animated);

          let chart = am4core.create("chartdiv", am4maps.MapChart);
          chart.geodata = am4geodata_usaLow;
          chart.projection = new am4maps.projections.AlbersUsa();
          let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
          polygonSeries.heatRules.push({
            property: "fill",
            target: polygonSeries.mapPolygons.template,
            min: chart.colors.getIndex(1).brighten(1),
            max: chart.colors.getIndex(1).brighten(-0.3)
          });
          polygonSeries.useGeodata = true;
          polygonSeries.data = this.resultDatas;

          // Set up heat legend
          let heatLegend = chart.createChild(am4maps.HeatLegend);
          //     heatLegend.orientation = "vertical";
          heatLegend.series = polygonSeries;
          heatLegend.align = "right";
          heatLegend.valign = "bottom";
          heatLegend.width = am4core.percent(20);
          heatLegend.marginRight = am4core.percent(4);
          heatLegend.minValue = 0;
          heatLegend.maxValue = 40000000;

          // Set up custom heat map legend labels using axis ranges
          let minRange = heatLegend.valueAxis.axisRanges.create();
          minRange.value = heatLegend.minValue;
          minRange.label.text = "Lowest";
          let maxRange = heatLegend.valueAxis.axisRanges.create();
          maxRange.value = heatLegend.maxValue;
          maxRange.label.text = "Highest";

          // Blank out internal heat legend value axis labels
          heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText) {
            return "";
          });

          let polygonTemplate = polygonSeries.mapPolygons.template;
          polygonTemplate.tooltipText = "{name}: {value}";
          polygonTemplate.nonScalingStroke = true;
          polygonTemplate.strokeWidth = 0.5;

          polygonTemplate.fill = am4core.color("#5CAB7D");
          polygonTemplate.propertyFields.fill = "color";

          polygonTemplate.events.on("hit", function(ev) {
            chart.closeAllPopups();
            let popup = chart.openPopup(
            "State: <strong>" + JSON.stringify(ev.target.dataItem.dataContext).split(',')[0].split(':')[1].split('-')[1].split('"')[0] + "</strong><br>\
            Total Cases: <strong>" + JSON.stringify(ev.target.dataItem.dataContext).split(',')[2].split(':')[1] + "</strong><br>\
            Total Vaccinations: <strong>" + JSON.stringify(ev.target.dataItem.dataContext).split(',')[3].split(':')[1] + "</strong><br>\
            Population Density (mi<sup>2</sup>): <strong>" + JSON.stringify(ev.target.dataItem.dataContext).split(',')[4].split(':')[1] + "</strong><br>");
            // popup.left = ev.svgPoint.x + 15;
            // popup.top = ev.svgPoint.y + 15;
          });

          // Create hover state and set alternative fill color
          let hs = polygonTemplate.states.create("hover");
          hs.properties.fill = am4core.color("#3c5bdc");

        });
      });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
