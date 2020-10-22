import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
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

  generateDomainCoursesCountGraph (indicator: string) {
    this.courses = [];
    this.categories = [];
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
  }

  generateDurationCoursesCountGraph (indicator: string) {
    console.log(indicator);
    this.courses = [];
    this.categories = [];
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
  }

  generateDedicationCoursesCountGraph (indicator: string) {
    console.log(indicator);
    this.courses = [];
    this.categories = [];
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
    console.log(this.dedications);
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
