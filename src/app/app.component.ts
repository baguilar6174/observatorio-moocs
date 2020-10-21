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
export class AppComponent implements OnInit{
  title = 'moocs-observatory';

  characters$: Observable<Character[]>;

  constructor(private googleSheetsDbService: GoogleSheetsDbService) { }

  ngOnInit(): void {
    this.characters$ = this.googleSheetsDbService.getActive<Character>(
      environment.characters.spreadsheetId, environment.characters.worksheetId, characterAttributesMapping, 'Active');
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
}
