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
  //Actualización en gráfico de TreeMap Dominio
  updateFlag3 = false;
  //Actualización en gráfico de TreeMap DurationWeek
  updateFlag4 = false;
  //Actualización en gráfico de TreeMap DurationHours
  updateFlag5 = false;

  //Variable spara almacenar datos
  data = [];
  cards = [];
  courses = [];
  categories = [];
  domains = [];
  durations = [];
  dedications = [];

  constructor(private ds: DataService) { }

  ngOnInit(): void {
    this.ds.getData().subscribe((data: Record[]) => {
      this.data = data;
      let indicator: string = 'MOOC';
      this.generateCards();
      this.generateCoursesCountGraph(indicator);
      this.generateDomainCoursesCountGraph(indicator);
      this.generateDurationCoursesCountGraph(indicator);
      this.generateDedicationCoursesCountGraph(indicator);
    });
  }

  updateGraphs(indicator: string, index: number) {
    
    //Control de card activada y desactivada
    for (var _i = 0; _i < this.cards.length; _i++) {
      if(index === _i){
        this.cards[_i].select = true;
      }else{
        this.cards[_i].select = false;
      }
    }

    this.generateCoursesCountGraph(indicator);
    this.generateDomainCoursesCountGraph(indicator);
    this.generateDurationCoursesCountGraph(indicator);
    this.generateDedicationCoursesCountGraph(indicator);
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

  generateCoursesCountGraph(indicator: string) {
    // generate data
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

    // Graph update
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
  }

  generateDomainCoursesCountGraph (indicator: string) {
    // generate data
    this.domains = [];
    let item, arr = [];
    for (item of this.data) {
      (item.mooc_spooc===indicator) && arr.push(item.dominio_aprendizaje);
    }
    let counts = this.getCount(arr);
    for (const property in counts) {
      this.domains.push({ name: property, value: counts[property], colorValue: 1 });
    }
    this.domains.sort(this.compareWithValueField);
    let i :number = 1;
    for (item of this.domains) {
      item.colorValue=i++;
    }

    // update graph
    this.chartOptions3.series[0] = {
      type: 'treemap',
      data: this.domains
    }
    this.updateFlag3 = true;
  }

  generateDurationCoursesCountGraph (indicator: string) {
    // generate data
    this.durations = [];
    let item, label, a, b, arr = [];
    for (item of this.data) {
      if (item.mooc_spooc===indicator) {
        a = item.duracion_semanas.split('/');
        if(a[0].includes("semana")) {
          b = a[0].split(' ');
          label = (b[0]==='1') ? (b[0]+' semana') : (b[0]+' semanas');
        } else {
          label = a[0];
        }
        arr.push(label);
      }
    }
    let counts = this.getCount(arr);
    for (const property in counts) {
      this.durations.push({ name: property, value: counts[property], colorValue: 1 });
    }
    this.durations.sort(this.compareWithValueField);
    let i :number = 1;
    for (item of this.durations) {
      item.colorValue=i++;
    }

    // update graph
    this.chartOptions4.series[0] = {
      type: 'treemap',
      data: this.durations
    }
    this.updateFlag4 = true;
  }

  generateDedicationCoursesCountGraph (indicator: string) {
    // generate data 
    this.dedications = [];
    let item, label, a, b, arr = [];
    for (item of this.data) {
      if (item.mooc_spooc===indicator) {
        a = item.dedicacion_horas_semanas.split('/');
        if(a[0].includes("hora")) {
          b = a[0].split(' ');
          if (Number(b[0].trim())) {
            label = {institution: item.institucion, dedication: Number(b[0].trim())};
            arr.push(label);
          }
        } 
      }
    }

    arr.sort(this.compareWithInstitutionField);
    let institution= (arr[0]) ? arr[0].institution: '';
    let sum: number = 0, cont: number = 0, counts = [];
    for (item of arr) {
      if (item.institution===institution) {
        sum += Number(item.dedication);
        cont++;
      } else {
        counts.push({name: institution, value: (Math.round((sum/cont)*100)/100), colorValue: 1});
        institution = item.institution;
        sum = Number(item.dedication);
        cont = 1;
      }
    }
    counts.push({name: item.institution, value: (sum/cont), colorValue: 1});
    this.dedications = counts;
    this.dedications.sort(this.compareWithValueField);
    let i :number = 1;
    for (item of this.dedications) { item.colorValue=i++; }

    // update graph
    this.chartOptions5.series[0] = {
      type: 'treemap',
      data: this.dedications
    }
    this.updateFlag5 = true;
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

  compareWithValueField(a, b) {
    if (a.value > b.value) return -1;
    if (b.value > a.value) return 1;
    return 0;
  }

  compareWithInstitutionField(a, b) {
    if (a.institution > b.institution) return 1;
    if (b.institution > a.institution) return -1;
    return 0;
  }


  
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

  // Tree Map Domain
  chartOptions3: Highcharts.Options = {

    chart: {
      style: {
        fontFamily: 'Poppins'
      }
    },
    colorAxis: {
      minColor: '#0d47a1',
      maxColor: '#e3f2fd',
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
  };

  // Tree Map DurationWeek
  chartOptions4: Highcharts.Options = {

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
  };

  // Tree Map DurationHours
  chartOptions5: Highcharts.Options = {

    chart: {
      style: {
        fontFamily: 'Poppins'
      }
    },
    colorAxis: {
      minColor: '#b71c1c',
      maxColor: '#ffebee',
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
  };

}
