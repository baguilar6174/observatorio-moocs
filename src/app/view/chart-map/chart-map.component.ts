import { Component, OnInit } from '@angular/core';
import * as Highcharts from "highcharts/highmaps";
declare var require: any
const worldMap = require('@highcharts/map-collection/countries/ec/ec-all.geo.json');

@Component({
  selector: 'app-chart-map',
  templateUrl: './chart-map.component.html',
  styleUrls: ['./chart-map.component.scss']
})
export class ChartMapComponent implements OnInit {

  ngOnInit(): void {
    
  }

  title = "app";
  chart;
  updateFromInput = false;
  Highcharts = Highcharts;
  chartConstructor = "mapChart";
  chartCallback;
  chartOptions = {
    chart: {
      map: worldMap
    },
    title: {
      text: 'Cursos por provincia'
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        alignTo: 'spacingBox'
      }
    },
    colorAxis: {
      min: 0
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'Cursos',
      states: {
        hover: {
          color: '#BADA55'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
      allAreas: false,
      data: [
        ['ec-gu', 0],
        ['ec-es', 1],
        ['ec-cr', 2],
        ['ec-im', 3],
        ['ec-su', 4],
        ['ec-se', 5],
        ['ec-sd', 6],
        ['ec-az', 7],
        ['ec-eo', 8],
        ['ec-lj', 9],
        ['ec-zc', 10],
        ['ec-cn', 11],
        ['ec-bo', 12],
        ['ec-ct', 13],
        ['ec-lr', 14],
        ['ec-mn', 15],
        ['ec-cb', 16],
        ['ec-ms', 17],
        ['ec-pi', 18],
        ['ec-pa', 19],
        ['ec-1076', 20],
        ['ec-na', 21],
        ['ec-tu', 22],
        ['ec-ga', 23]
      ]
    }]
  };

  constructor() {
    const self = this;

    this.chartCallback = chart => {
      self.chart = chart;
    };
  }

}
