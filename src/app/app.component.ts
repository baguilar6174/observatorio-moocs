import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { Observable } from 'rxjs';
import { Character, characterAttributesMapping } from './character.model';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  characters$: Observable<Character[]>;

  constructor(private googleSheetsDbService: GoogleSheetsDbService) { }

  ngOnInit(): void {
    this.characters$ = this.googleSheetsDbService.getActive<Character>(
      environment.characters.spreadsheetId, environment.characters.worksheetId, characterAttributesMapping, 'Active');
  }

  onClick(indicator) {
    console.log(indicator);
    this.chartOptions.title = {
      text: `Cantidad ${indicator.type} Registros por Universidad`
    };
    this.data = [
      {
        name: "Universidad 1",
        y: 98.74
      },
      {
        name: "Universidad 2",
        y: 40.57
      },
      {
        name: "Universidad 3",
        y: 20.23
      },
      {
        name: "Universidad 4",
        y: 45.58
      }
    ];
    this.chartOptions.series[0] = {
      type: 'bar',
      data: this.data
    }
    this.updateFlag = true;
  }

  public indicators = [
    { type: 'MOOC', value: 35, },
    { type: 'SPOOC', value: 445455, },
    { type: 'NOOC', value: 5, },
  ];

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  public data = [
    {
      name: "Universidad 1",
      y: 52.74
    },
    {
      name: "Universidad 2",
      y: 40.57
    },
    {
      name: "Universidad 3",
      y: 30.23
    },
    {
      name: "Universidad 4",
      y: 25.58
    },
    {
      name: "Universidad 5",
      y: 14.02
    },
    {
      name: "Universidad 6",
      y: 5.92
    },
    {
      name: "Universidad 7",
      y: 1.62
    }
  ];

  public categories = ['Universidad 1', 'Universidad 2', 'Universidad 3', 'Universidad 4', 'Universidad 5', 'Universidad 6', 'Universidad 7'];

  chartOptions: Highcharts.Options = {
    title: {
      text: `Cantidad MOOC Registros por Universidad`
    },
    xAxis: {
      type: 'category',
      title: {
        text: 'Universidad/Institución'
      },
      categories: this.categories
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Número de registros'
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: "Registros",
        colorByPoint: false,
        color: '#4179AB',
        type: "bar",
        data: this.data
      }
    ]
  };

}
