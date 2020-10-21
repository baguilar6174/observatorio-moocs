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
  
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  data = [];
  cards = [];
  courses = [];
  categories = [];

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.ds.getData().subscribe((data: Record[]) => {
      this.data = data;
      this.generateCards();
      this.generateCoursesCountGraph('SPOC');
    });
  }

  generateCards () {
    let item, arr = [];
    for (item of this.data) {
      arr.push(item.mooc_spooc);
    }
    let counts = this.getCount(arr);
    for (const property in counts) {
      this.cards.push({ type: property, value: counts[property] });
    }
  }

  generateCoursesCountGraph (indicator: string) {
    this.courses = [];
    this.categories = [];
    let item, arr = [];
    for (item of this.data) {
      (item.mooc_spooc===indicator) && arr.push(item.institucion);
    }
    let counts = this.getCount(arr);
    for (const property in counts) {
      this.courses.push({ name: property, y: counts[property] });
    }
    this.courses.sort(this.compareCoursesCount);
    for (item of this.courses) {
      this.categories.push(item.name);
    }

    this.chartOptions.series[0] = {
      type: 'bar',
      data: this.courses
    }
    this.chartOptions.xAxis = { categories: this.categories};
    this.chartOptions.title = { text: `Número de registros ${indicator} por universidad` };
    this.updateFlag = true;

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


  
  chartOptions: Highcharts.Options = {
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
