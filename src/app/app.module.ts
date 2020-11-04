import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClientModule } from '@angular/common/http';
import { GoogleSheetsDbService } from 'ng-google-sheets-db';
import { ChartModule } from 'angular-highcharts';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalCoursesComponent } from './view/modal-courses/modal-courses.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ModalCoursesComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    HttpClientModule,
    ChartModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [GoogleSheetsDbService],
  entryComponents: [ModalCoursesComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
