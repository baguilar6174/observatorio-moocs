import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Record } from './models/record.model';
import { DataService } from './services/data.service';

import More from 'highcharts/highcharts-more';
More(Highcharts);
import Tree from 'highcharts/modules/treemap';
Tree(Highcharts);
import Heatmap from 'highcharts/modules/heatmap';
Heatmap(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  //Para los histogramas
  Highcharts: typeof Highcharts = Highcharts;

  //Actualización en gráfico de Registros MOOC/SPOOC por universidad
  updateFlag = false;
  //Actualización en gráfico de Recuento MOOC/SPOOC por universidad
  updateFlag2 = false;

  // COntenedores para TreeMap
  @ViewChild("containerDomain", { read: ElementRef }) container1: ElementRef;
  @ViewChild("containerDurationWeeks", { read: ElementRef }) container2: ElementRef;
  @ViewChild("containerDurationHours", { read: ElementRef }) container3: ElementRef;

  //Variable spara almacenar datos
  data = [];
  cards = [];
  courses = [];
  categories = [];

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.ds.getData().subscribe((data: Record[]) => {
      this.data = data;
      this.generateCards();
      this.generateCoursesCountGraph('MOOC', 0);
    });
  }

  ngAfterViewInit() {
    // Tree Map Domain
    Highcharts.chart(this.container1.nativeElement, {
      chart: {
        style: {
          fontFamily: 'Poppins'
        }
      },
      colorAxis: {
        minColor: '#4179AB',
        maxColor: '#fff',
      },
      series: [{
        type: 'treemap',
        data: [{
          name: 'Ciencias aplicadas',
          value: 6,
          colorValue: 1
        }, {
          name: 'Estudios Sociales',
          value: 6,
          colorValue: 2
        }, {
          name: 'Matematicas',
          value: 4,
          colorValue: 3
        }, {
          name: 'lenguaje y literatura',
          value: 3,
          colorValue: 4
        }, {
          name: 'E',
          value: 2,
          colorValue: 5
        }, {
          name: 'F',
          value: 2,
          colorValue: 6
        }, {
          name: 'Gastronomia',
          value: 1,
          colorValue: 7
        }]
      }],
      title: {
        text: 'Dominios'
      }
    });

    // Tree Map DurationWeeks
    Highcharts.chart(this.container2.nativeElement, {
      chart: {
        style: {
          fontFamily: 'Poppins'
        }
      },
      colorAxis: {
        minColor: '#007E33',
        maxColor: '#fff',
      },
      series: [{
        type: 'treemap',
        data: [{
          name: 'A',
          value: 6,
          colorValue: 1
        }, {
          name: 'B',
          value: 6,
          colorValue: 2
        }, {
          name: 'C',
          value: 4,
          colorValue: 3
        }, {
          name: 'D',
          value: 3,
          colorValue: 4
        }, {
          name: 'E',
          value: 2,
          colorValue: 5
        }, {
          name: 'F',
          value: 2,
          colorValue: 6
        }, {
          name: 'G',
          value: 1,
          colorValue: 7
        }]
      }],
      title: {
        text: 'Duración en semanas'
      }
    });

    // Tree Map DurationHours
    Highcharts.chart(this.container3.nativeElement, {
      chart: {
        style: {
          fontFamily: 'Poppins'
        }
      },
      colorAxis: {
        minColor: '#0d47a1',
        maxColor: '#fff',
      },
      series: [{
        type: 'treemap',
        data: [{
          name: 'A',
          value: 6,
          colorValue: 1
        }, {
          name: 'B',
          value: 6,
          colorValue: 2
        }, {
          name: 'C',
          value: 4,
          colorValue: 3
        }, {
          name: 'D',
          value: 3,
          colorValue: 4
        }, {
          name: 'E',
          value: 2,
          colorValue: 5
        }, {
          name: 'F',
          value: 2,
          colorValue: 6
        }, {
          name: 'G',
          value: 1,
          colorValue: 7
        }]
      }],
      title: {
        text: 'Duración en horas'
      }
    });
  }

  generateCards() {
    let item, arr = [];
    let cont : number = 0;
    for (item of this.data) {
      arr.push(item.mooc_spooc);
    }
    let counts = this.getCount(arr);
    for (const property in counts) {
      cont++;
      if(cont==1){
        this.cards.push({ type: property, value: counts[property], select: true});
      }else{
        this.cards.push({ type: property, value: counts[property], select: false});
      }
    }
  }

  generateCoursesCountGraph(indicator: string, index: number) {
    this.courses = [];
    this.categories = [];
    let item, arr = [];
    for (item of this.data) {
      (item.mooc_spooc === indicator) && arr.push(item.institucion);
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
    this.chartOptions.xAxis = { categories: this.categories };
    this.chartOptions.title = { text: `Número de registros ${indicator} por universidad` };
    this.updateFlag2 = true;

    /**----------------------------------- */

    this.chartOptions2.series[0] = {
      type: 'bar',
      data: this.courses
    }
    this.chartOptions2.xAxis = { categories: this.categories };
    this.chartOptions2.title = { text: `Número de MOOC/SPOOC ${indicator} por universidad` };
    this.updateFlag = true;

    //Control de card activada y desactivada

    for (var _i = 0; _i < this.cards.length; _i++) {
      if(index === _i){
        this.cards[_i].select = true;
      }else{
        this.cards[_i].select = false;
      }
    }
  }

  getCount(arr) {
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

  //gráfico de Registros MOOC/SPOOC por universidad
  chartOptions: Highcharts.Options = {
    chart: {
      style: {
        fontFamily: 'Poppins'
      }
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

  //Recuento MOOC/SPOOC por universidad
  chartOptions2: Highcharts.Options = {

    chart: {
      style: {
        fontFamily: 'Poppins'
      }
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
        text: 'Recuento de MOOC/SPOOC'
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: "Registros",
        colorByPoint: true,
        color: '#4179AB',
        type: "bar",
        data: this.data
      }
    ]
  };

}
