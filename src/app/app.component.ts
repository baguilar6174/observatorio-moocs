import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs';
import { Record } from './models/record.model';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'moocs-observatory';
  cards = [];
  courses = [];

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.ds.getData().subscribe((data: Record[]) => {
      this.generateCards(data);
      this.generateCoursesCountGraph(data, 'SPOC');
    });
  }

  generateCards (data: Record[]) {
    let item, arr = [];
    for (item of data) {
      arr.push(item.mooc_spooc);
    }
    let counts = this.getCount(arr);
    for (const property in counts) {
      this.cards.push({ type: property, value: counts[property] });
    }
  }

  generateCoursesCountGraph (data: Record[], indicator: string) {
    let item, arr = [];
    for (item of data) {
      (item.mooc_spooc===indicator) && arr.push(item.institucion);
    }
    let counts = this.getCount(arr);
    let categories = [];
    for (const property in counts) {
      this.courses.push({ name: property, y: counts[property] });
    }
    this.courses.sort(this.compareCoursesCount);
    for (item of this.courses) {
      categories.push(item.name);
    }
    console.log(categories);
    console.log(this.courses);

  }

  getCount (arr) {
    let i, counts = {};
    for (i = 0; i < arr.length; i++) {
      counts[arr[i]] = 1 + (counts[arr[i]] || 0);
    }
    return counts;
  }

  compareCoursesCount(a, b) {
    if (a.y > b.y) return -1;
    if (b.y > a.y) return 1;
    return 0;
  }


  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    series: [{
      data: [1, 2, 3],
      type: 'line'
    }]
  };
}
