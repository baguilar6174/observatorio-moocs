import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Record } from './models/record.model';
import { DataService } from './services/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var require: any
declare let $: any;

const worldMap = require('@highcharts/map-collection/countries/ec/ec-all.geo.json');

import More from 'highcharts/highcharts-more';
More(Highcharts);
import Tree from 'highcharts/modules/treemap';
Tree(Highcharts);
import Heatmap from 'highcharts/modules/heatmap';
Heatmap(Highcharts);

import HighchartsMap from "highcharts/modules/map";
import { ModalCoursesComponent } from './view/modal-courses/modal-courses.component';
HighchartsMap(Highcharts);

import { Chart } from 'angular-highcharts';
import { FormBuilder } from '@angular/forms';


const noData = require('highcharts/modules/no-data-to-display')
noData(Highcharts)


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  //Para los histogramas
  Highcharts: typeof Highcharts = Highcharts;

  // Modal Treemap
  modalRef: BsModalRef;

  // Modal Aboutus
  public modalRefAboutUs: BsModalRef;

  //Actualización en gráfico de TreeMap Dominio
  updateFlag3 = false;
  //Actualización en gráfico de TreeMap DurationWeek
  updateFlag4 = false;
  //Actualización en gráfico de Column Dedication
  updateFlag5 = false;
  // Actualizacion en gráfico mapa
  updateFlag6 = false;


  // Indicator Global (MOOC/NOOC/SPOC)
  indicatorGlobal: string = '';
  // mapa con provincias del ecuador
  ecuadorProvincesMap: Map<any, any>;
  // Stacked Bar (registros mooc/cpoc/nooc por unversidad)
  coursesStackedBarChart = new Chart();
  // Stacked Bar (plataformas por institución)
  platformsStackedBarChart = new Chart();
  // snackbar (registros mooc/cpoc/nooc por unversidad)
  categoriesCourses = [];
  seriesInstitutions = [];
  // Google spreadsheet data
  allData = [];
  data = [];
  // main cards
  cards = [];
  // Sites map
  sites;
  // years combobox
  years: any = [];



  constructor(
    private ds: DataService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) { }

  dataForm = this.formBuilder.group({
    year: [],
  });

  
  ngOnInit(): void {
    this.ds.getData().subscribe((resp: Record[]) => {
      this.allData=resp;
      this.loadYears(resp);
      this.loadData(resp);
    });
  }

  ngAfterViewInit(): void {
    let tmpThis = this;
    $(document).ready(function () {
      $(document).on('click', '.tooltip-platform', function (e) {
        e.preventDefault();
        let url = tmpThis.sites.get(e.originalEvent.target.innerText);
        window.open(url, "_blank");
      });
    });
  }


  // functions
  loadYears(data: Record[]) {
    let item, arr = [];
    for (item of data) {
      arr.push(item.anio.trim());
    }
    let counts = this.getCount(arr);
    arr = [];
    for (const property in counts) {
      arr.push(property.toString());
    }
    this.years = arr;
    let yearLabel=(this.years && this.years.length) ? this.years[0] : ''; 
    this.dataForm.setValue({ year: yearLabel });
  }

  loadData(data: Record[]) {
    let item, arr = [];
    let yearLabel = this.dataForm.value['year'];
    if (this.years && this.years.length) {
      for (item of data) {
        if (item.anio.trim()===yearLabel) {
          arr.push(item);
        }
      }
      this.data = arr;
    } else {
      this.data = [];
    }
    
    // generar datos que no cambian con la 
    // actualizacion de las cards
    this.generateRootSiteUrlList();
    this.generateCards();
    
    // actualizar las graficas que si
    // cambian con las cards
    this.generateMap();
    this.generateCoursesCountGraph();
    this.generateDomainCoursesCountGraph();
    this.generateDurationCoursesCountGraph();
    this.generateDedicationCoursesCountGraph();
    this.generatePlatformCountGraph();
  }

  changeYear(e) {
    this.loadData(this.allData);
  } 

  updateGraphs(indicator: string, index: number) {
    this.indicatorGlobal = indicator;
    //Control de card activada y desactivada
    for (var _i = 0; _i < this.cards.length; _i++) {
      if (index === _i) {
        this.cards[_i].select = true;
      } else {
        this.cards[_i].select = false;
      }
    }

    // update graphs
    this.generateMap();
    this.generateCoursesCountGraph();
    this.generateDomainCoursesCountGraph();
    this.generateDurationCoursesCountGraph();
    this.generateDedicationCoursesCountGraph();
  }

  loadEcuadorianProvinces() {
    this.ecuadorProvincesMap = new Map();
    this.ecuadorProvincesMap.set('ec-gu', 0);
    this.ecuadorProvincesMap.set('ec-es', 0);
    this.ecuadorProvincesMap.set('ec-cr', 0);
    this.ecuadorProvincesMap.set('ec-im', 0);
    this.ecuadorProvincesMap.set('ec-su', 0);
    this.ecuadorProvincesMap.set('ec-se', 0);
    this.ecuadorProvincesMap.set('ec-sd', 0);
    this.ecuadorProvincesMap.set('ec-az', 0);
    this.ecuadorProvincesMap.set('ec-eo', 0);
    this.ecuadorProvincesMap.set('ec-lj', 0);
    this.ecuadorProvincesMap.set('ec-zc', 0);
    this.ecuadorProvincesMap.set('ec-cn', 0);
    this.ecuadorProvincesMap.set('ec-bo', 0);
    this.ecuadorProvincesMap.set('ec-ct', 0);
    this.ecuadorProvincesMap.set('ec-lr', 0);
    this.ecuadorProvincesMap.set('ec-mn', 0);
    this.ecuadorProvincesMap.set('ec-cb', 0);
    this.ecuadorProvincesMap.set('ec-ms', 0);
    this.ecuadorProvincesMap.set('ec-pi', 0);
    this.ecuadorProvincesMap.set('ec-pa', 0);
    this.ecuadorProvincesMap.set('ec-1076', 0);
    this.ecuadorProvincesMap.set('ec-na', 0);
    this.ecuadorProvincesMap.set('ec-tu', 0);
    this.ecuadorProvincesMap.set('ec-ga', 0);
  }

  generateRootSiteUrlList() {
    let item: Record, key: string, value: string;
    this.sites = new Map();
    for (item of this.data) {
      key = item.institucion.trim();
      value = item.site_url.trim();
      this.sites.set(key, value);
    }
  }

  


  // Graphs Functions
  generateMap() {

    this.loadEcuadorianProvinces();

    let item, key, provincesMap = new Map;
    for (item of this.data) {
      if (item.mooc_spooc === this.indicatorGlobal) {
        key = item.provincia_codigo.trim();
        if (provincesMap.has(key)) {
          provincesMap.get(key).push(item);
        } else {
          provincesMap.set(key, [item]);
        }
      }
    }

    for (let [key, value] of provincesMap) {
      if (this.ecuadorProvincesMap.has(key)) {
        this.ecuadorProvincesMap.set(key, value.length);
      }
    }

    let count = [];
    for (let [key, value] of this.ecuadorProvincesMap) {
      count.push([key, value]);
    }

    this.chartOptionsMap.title.text = `Cursos ${this.indicatorGlobal} por provincia`;
    this.chartOptionsMap.series[0].data = count;
    this.updateFlag6 = true;
  }

  generateCards() {
    this.cards = [];
    let item, arr = [];
    for (item of this.data) {
      arr.push(item.mooc_spooc);
    }
    let counts = this.getCount(arr);
    // console.log(counts);
    let definitions = {
      MOOC:'Los MOOCs son cursos diseñados para un número masivo de estudiantes, accesibles por cualquier persona desde cualquier lugar siempre y cuando tenga conexión a internet, sin restricciones de acceso por nota, y que se ofrecen únicamente online por medio de una plataforma para MOOC, de manera periódica o de forma contínua',
      SPOC:'Cursos que utilizan la misma metodología y plataformas que los MOOCs pero de forma privada con control de acceso. Se utilizan de manera general como complemento a la enseñanza presencial mediante lo que se conoce como ‘blended learning’. Al ser un entorno controlado, se pueden añadir funcionalidades especiales que no tienen sentido en un curso abierto y masivo',
      NOOC:'Nano-MOOC o también Objetos de Aprendizaje, es una unidad didáctica digital independiente, cuya estructura está formada por un objetivo de aprendizaje específico, un contenido, un conjunto de actividades y una autoevaluación, planteando así una experiencia de aprendizaje reducida en el tiempo.'
    };
    for (const property in counts) {
      this.cards.push({ type: property, value: counts[property], select: false, definition: definitions[property]}); 
    }
    this.cards.sort(this.compareWithValueFieldDesc);
    this.cards[0].select=true;
    this.indicatorGlobal = this.cards[0].type || '';
  }

  generateCoursesCountGraph() {

    // generate data 
    let item, key, arrInst = [], arrTypeInst = [];
    let universitiesMap = new Map();
    let auxInstTypeMap = new Map();
    let instTypeMap = new Map();

    // get universities map
    for (item of this.data) {
      if ((item.mooc_spooc === this.indicatorGlobal)) {
        key = item.institucion.trim();
        if (universitiesMap.has(key)) {
          universitiesMap.get(key).push(item);
        } else {
          universitiesMap.set(key, [item]);
        }

        key = item.tipo_institucion.trim().toLowerCase();
        auxInstTypeMap.set(key, 0);
        instTypeMap.set(key, []);

        arrTypeInst.push(item.tipo_institucion.trim().toLowerCase());
        arrInst.push(item.institucion.trim());
      }
    }
    // console.log(universitiesMap);
    // console.log(auxInstTypeMap);
    // console.log(instTypeMap);


    // get institutions type
    let counts = this.getCount(arrTypeInst);
    arrTypeInst = [];
    for (const property in counts) {
      arrTypeInst.push({ name: property, value: counts[property] });
    }
    arrTypeInst.sort(this.compareWithValueFieldDesc);
    // console.log(arrTypeInst);

    // get universities
    counts = this.getCount(arrInst);
    arrInst = [];
    for (const property in counts) {
      arrInst.push({ name: property, value: counts[property] });
    }
    arrInst.sort(this.compareWithValueFieldDesc);
    // console.log(arrInst);


    let record, tipo_institucion;
    for (item of arrInst) {
      // console.log({name: item.name});
      // console.log(universitiesMap.get(item.name));
      for (record of universitiesMap.get(item.name)) {
        tipo_institucion = record.tipo_institucion.trim().toLowerCase();
        auxInstTypeMap.set(tipo_institucion, (auxInstTypeMap.get(tipo_institucion) + 1));
        // console.log(platform);
      }
      // console.log(auxPlatformMap);
      for (let [key, value] of auxInstTypeMap) {
        instTypeMap.get(key).push(value);
      }
      auxInstTypeMap = this.getEmptyMap(auxInstTypeMap);
    }
    // console.log(instTypeMap);

    let categoriesCourses = [];
    let seriesInstitutions = [];
    // categories
    for (item of arrInst) {
      categoriesCourses.push(item.name);
    }
    // console.log(categoriesCourses);

    // series
    for (let [key, value] of instTypeMap) {
      seriesInstitutions.push({ name: this.capitalize(key), type: 'bar', data: value });
    }
    // console.log(seriesInstitutions);

    let chart = new Chart({
      chart: {
        type: "bar",
        style: {
          fontFamily: 'Poppins'
        }
      },
      title: {
        text: `Número de Registros ${this.indicatorGlobal} por Universidad`
      },
      xAxis: {
        categories: categoriesCourses
      },
      yAxis: {
        min: 0,
        title: {
          text: `Número de ${this.indicatorGlobal}s`
        }
      },
      plotOptions: {
        series: {
          stacking: "normal"
        }
      },
      credits: {
        enabled: false
      },
      lang: {
        noData: 'No hay datos que mostrar'
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        borderRadius: 0.0,
        borderWidth: 0.0,
        padding: 15.0,
        useHTML: true,
        enabled: true,
        animation: false,
        distance: 25,
        followTouchMove: true,
        hideDelay: 2000,
        style: { "color": "black", "cursor": "default", "fontSize": "12px", "pointerEvents": "auto", "whiteSpace": "normal" },
        formatter: function () {
          return '<a href="#" target="_blank" class="tooltip-platform">' + this.x + '</a>' + '<br><b>Número de cursos: ' + this.y + '<b>';
        }
      },
      series: seriesInstitutions
    });

    this.coursesStackedBarChart = chart;

  }

  generateDomainCoursesCountGraph() {
    // generate data
    let domains = [];
    let item, arr = [];
    for (item of this.data) {
      (item.mooc_spooc === this.indicatorGlobal) && arr.push(item.dominio_aprendizaje);
    }
    let counts = this.getCount(arr);
    for (const property in counts) {
      domains.push({ name: property, value: counts[property], colorValue: 1 });
    }
    domains.sort(this.compareWithValueFieldDesc);
    for (item of domains) {
      item.colorValue = item.value;
    }

    // update graph
    this.chartOptions3.series[0] = {
      type: 'treemap',
      data: domains
    }
    this.updateFlag3 = true;
  }

  generateDurationCoursesCountGraph() {
    // generate data
    let durations = [];
    let item, label, a, b, arr = [];
    for (item of this.data) {
      if (item.mooc_spooc === this.indicatorGlobal) {
        a = item.duracion_semanas.split('/');
        if (a[0].includes("semana")) {
          b = a[0].split(' ');
          label = (b[0] === '1') ? (b[0] + ' semana') : (b[0] + ' semanas');
          arr.push(label);
        }
      }
    }

    let counts = this.getCount(arr);
    for (const property in counts) {
      durations.push({ name: property, value: counts[property], colorValue: 1 });
    }
    durations.sort(this.compareWithValueFieldDesc);
    for (item of durations) {
      item.colorValue = item.value;
    }

    // update graph
    this.chartOptions4.series[0] = {
      type: 'treemap',
      data: durations
    }
    this.updateFlag4 = true;
  }

  generateDedicationCoursesCountGraph() {
    // generate data 
    let dedications = [];
    let item, label, a, b, arr = [];
    for (item of this.data) {
      if (item.mooc_spooc === this.indicatorGlobal) {
        a = item.dedicacion_horas_semanas.split('/');
        if (a[0].includes("hora")) {
          b = a[0].split(' ');
          if (Number(b[0].trim())) {
            label = { institution: item.institucion, dedication: Number(b[0].trim()) };
            arr.push(label);
          }
        }
      }
    }

    arr.sort(this.compareWithInstitutionField);
    let institution = (arr[0]) ? arr[0].institution : '';
    let sum: number = 0, cont: number = 0, counts = [];
    for (item of arr) {
      if (item.institution === institution) {
        sum += Number(item.dedication);
        cont++;
      } else {
        counts.push({ name: institution, value: (Math.round((sum / cont) * 100) / 100) });
        institution = item.institution;
        sum = Number(item.dedication);
        cont = 1;
      }
    }
    counts.push({ name: item.institution, value: (sum / cont) });
    counts.sort(this.compareWithValueFieldAsc);
    for (item of counts) {
      (item.value) && dedications.push([item.name, item.value]);
    }

    // update graph
    this.chartOptionsAvgDurationMooc.subtitle.text = `${this.indicatorGlobal}`;
    this.chartOptionsAvgDurationMooc.series[0] = {
      type: 'column',
      data: dedications
    }
    this.updateFlag5 = true;
  }

  generatePlatformCountGraph() {
    // generate data 
    let item, key, arrInst = [], arrPlat = [];
    let universitiesMap = new Map();
    let auxPlatformMap = new Map();
    let platformMap = new Map();

    // get universities map
    for (item of this.data) {
      key = item.institucion.trim();
      if (universitiesMap.has(key)) {
        universitiesMap.get(key).push(item);
      } else {
        universitiesMap.set(key, [item]);
      }

      key = item.plataforma.trim().toLowerCase();
      auxPlatformMap.set(key, 0);
      platformMap.set(key, []);

      arrPlat.push(item.plataforma);
      arrInst.push(item.institucion);
    }
    // console.log(universitiesMap);
    // console.log(auxPlatformMap);
    // console.log(platformMap);


    // get platforms
    let counts = this.getCount(arrPlat);
    arrPlat = [];
    for (const property in counts) {
      arrPlat.push({ name: property, value: counts[property] });
    }
    arrPlat.sort(this.compareWithNameField);
    // console.log(arrPlat);

    // get universities
    counts = this.getCount(arrInst);
    arrInst = [];
    for (const property in counts) {
      arrInst.push({ name: property, value: counts[property] });
    }
    arrInst.sort(this.compareWithValueFieldDesc);
    // console.log(arrInst);

    let record, platform;
    for (item of arrInst) {
      // console.log({name: item.name});
      // console.log(universitiesMap.get(item.name));
      for (record of universitiesMap.get(item.name)) {
        platform = record.plataforma.trim().toLowerCase();
        auxPlatformMap.set(platform, (auxPlatformMap.get(platform) + 1));
        // console.log(platform);
      }
      // console.log(auxPlatformMap);
      for (let [key, value] of auxPlatformMap) {
        platformMap.get(key).push(value);
      }
      auxPlatformMap = this.getEmptyMap(auxPlatformMap);
    }
    // console.log(platformMap);

    let categoriesPlatforms = [], seriesPlatforms = [];
    // categories
    for (item of arrInst) {
      categoriesPlatforms.push(item.name);
    }
    // console.log(this.categoriesPlatforms);

    // series
    for (let [key, value] of platformMap) {
      seriesPlatforms.push({ name: this.capitalize(key), type: 'bar', data: value });
    }
    // console.log(this.seriesPlatforms);

    let chart = new Chart({
      chart: {
        type: "bar",
        style: {
          fontFamily: 'Poppins'
        }
      },
      title: {
        text: `Plataformas utilizadas por Institución`
      },
      xAxis: {
        categories: categoriesPlatforms
      },
      yAxis: {
        min: 0,
        title: {
          text: `Recuento de MOOC/SPOC/NOOC`
        }
      },
      plotOptions: {
        series: {
          stacking: "normal"
        }
      },
      credits: {
        enabled: false
      },
      lang: {
        noData: 'No hay datos que mostrar'
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        borderRadius: 0.0,
        borderWidth: 0.0,
        padding: 15.0,
        useHTML: true,
        enabled: true,
        animation: false,
        distance: 25,
        followTouchMove: true,
        hideDelay: 2000,
        style: { "color": "black", "cursor": "default", "fontSize": "12px", "pointerEvents": "auto", "whiteSpace": "normal" },
        formatter: function () {
          return this.x + '<br> <b>Plataforma utilizada: </b>' + this.series.name + '<b><br>Número de cursos: ' + this.y + '</b>';
        }
      },
      series: seriesPlatforms
    });

    this.platformsStackedBarChart = chart;
  }


  // Helpers Functions
  capitalize(str, lower = false) {
    return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
  }

  getEmptyMap(map: Map<any, any>) {
    let aux = new Map();
    for (let [key, value] of map) {
      aux.set(key, 0);
    }
    return aux;
  }

  getCount(arr) {
    let i, counts = {};
    for (i = 0; i < arr.length; i++) {
      counts[arr[i].trim()] = 1 + (counts[arr[i].trim()] || 0);
    }
    return counts;
  }

  compareCoursesCount(a, b) {
    if (a.y > b.y) return -1;
    if (b.y > a.y) return 1;
    return 0;
  }

  compareWithValueFieldDesc(a, b) {
    if (a.value > b.value) return -1;
    if (b.value > a.value) return 1;
    return 0;
  }

  compareWithValueFieldAsc(a, b) {
    if (a.value > b.value) return 1;
    if (b.value > a.value) return -1;
    return 0;
  }

  compareWithNameField(a, b) {
    if (a.name > b.name) return 1;
    if (b.name > a.name) return -1;
    return 0;
  }

  compareWithInstitutionField(a, b) {
    if (a.institution > b.institution) return 1;
    if (b.institution > a.institution) return -1;
    return 0;
  }

  getCoursesListByDomainAndType(domain: string, courseType: string) {
    let item, list = [];
    for (item of this.data) {
      if ((item.mooc_spooc === courseType && item.dominio_aprendizaje === domain)) {
        list.push({ titulo: item.titulo_mooc, url: item.url_mooc });
      }
    }
    return list;
  }

  openModal(domain: string, courseType: string) {
    let list = this.getCoursesListByDomainAndType(domain, courseType);
    // console.log(list);
    const initialState = {
      domain: domain,
      courseType: courseType,
      list: list
    };
    this.modalRef = this.modalService.show(ModalCoursesComponent,
      { class: 'modal-dialog-centered modal-lg', initialState }
    );
    this.modalRef.content.closeBtnName = 'Close';

    this.modalRef.content.event.subscribe(res => {
      //this.itemList.push(res.data);
      // console.log(res.data);
    });
  }

  openModal_aboutus(template: TemplateRef<any>) {
    this.modalRefAboutUs = this.modalService.show(template);
    this.modalRefAboutUs.setClass('modal-dialog-centered');
  }

  moveSection(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }



  // Tree Map Domain
  chartOptions3: Highcharts.Options = {

    chart: {
      style: {
        fontFamily: 'Poppins'
      }
    },
    colorAxis: {
      minColor: '#e3f2fd',
      maxColor: '#0d47a1',
    },
    tooltip: {
      backgroundColor: '#fff',
      borderRadius: 0.0,
      borderWidth: 0.0,
      padding: 10.0,
      useHTML: true,
      enabled: true,
      animation: false,
      hideDelay: 500,
      style: { "color": "black", "cursor": "default", "fontSize": "12px", "pointerEvents": "auto", "whiteSpace": "normal" },
      formatter: function () {
        return this.point.name + '<p><b>Número de MOOC: </b>' + this.point.value + ' cursos<p>';
      }
    },
    credits: {
      enabled: false
    },
    lang: {
      noData: 'No hay datos que mostrar'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    series: [{
      dataLabels: [{
        enabled: true,
        verticalAlign: "top",
        align: 'left',
        style: { "whiteSpace": "normal", "position": "absolute", "top": "0" },
        formatter: function () {
          let total: number = Number(this.series['tree']['childrenTotal']);
          return `<p>${this.point.name}</p><br><p>${((this.point.value * 100) / total).toFixed(2)}%</p>`;
        },
        // useHTML: false,
      }],
      type: 'treemap',
      data: [],
      events: {
        click: (event) => {
          let cardSelected = this.cards.find(element => element.select);
          this.openModal(event.point.name, cardSelected.type);
        },
      }
    }],
    title: {
      text: 'Dominios de aprendizaje'
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
      minColor: '#fff',
      maxColor: '#007E33',
    },
    credits: {
      enabled: false
    },
    lang: {
      noData: 'No hay datos que mostrar'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    tooltip: {
      backgroundColor: '#fff',
      borderRadius: 0.0,
      borderWidth: 0.0,
      padding: 10.0,
      useHTML: true,
      enabled: true,
      animation: false,
      hideDelay: 500,
      style: { "color": "black", "cursor": "default", "fontSize": "12px", "pointerEvents": "auto", "whiteSpace": "normal" },
      formatter: function () {
        return '<p><b>Cursos con duración de ' + this.point.name + '</b>: ' + this.point.value + '<p>';
      }
    },
    series: [{
      type: 'treemap',
      dataLabels: [{
        enabled: true,
        verticalAlign: "top",
        align: 'left',
        style: { "whiteSpace": "normal", "position": "absolute", "top": "0" },
        formatter: function () {
          let total: number = Number(this.series['tree']['childrenTotal']) || 0;
          return `<p>${this.point.name}</p><br><p>${((this.point.value * 100) / total).toFixed(2)}%</p>`;
        },
      }],
      data: []
    }],
    title: {
      text: 'Duración en semanas de los cursos'
    }
  };

  // Duración promedio en horas de un MOOC por institución.
  chartOptionsAvgDurationMooc: Highcharts.Options = {

    chart: {
      type: 'column',
      style: {
        fontFamily: 'Poppins'
      }
    },
    colorAxis: {
      minColor: '#4179AB',
      maxColor: '#4179AB',
    },
    title: {
      text: 'Tipo curso / Universidad/Institución'
    },
    subtitle: {
      text: `${this.indicatorGlobal}`
    },
    xAxis: {
      type: 'category',
      labels: {
        style: {
          fontSize: '10px',
        }
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Promedio de horas por semana'
      },
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: 'Duración Promedio: <b>{point.y:.1f} horas</b>'
    },
    credits: {
      enabled: false
    },
    series: [{
      type: 'column',
      name: 'Duración',
      data: [],
      dataLabels: {
        verticalAlign: "top",
        format: '<p>{point.y:.1f}</p><br><p>horas</p>',
        useHTML: false,
        enabled: true,
        color: '#FFFFFF',
        style: {
          fontSize: '10px',
          textAlign: 'center',
        }
      }
    }],
    lang: {
      noData: 'No hay datos que mostrar'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
  };

  // Mapa de provincias
  chartOptionsMap = {
    chart: {
      map: worldMap,
      style: {
        fontFamily: 'Poppins'
      },
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
    lang: {
      noData: 'No hay datos que mostrar'
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
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
      data: []
    }]
  };
}
