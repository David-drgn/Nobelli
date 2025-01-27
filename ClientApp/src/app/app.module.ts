import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoginComponent } from './login/login.component';
import { NobelliComponent } from './nobelli/nobelli.component';
import { ClientsComponent } from './nobelli/clients/clients.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarComponent } from './nobelli/calendar/calendar.component';
import { ProductsComponent } from './nobelli/products/products.component';
import { ExcelComponent } from './nobelli/excel/excel.component';
import { BandsComponent } from './nobelli/bands/bands.component';

import { FullCalendarModule } from '@fullcalendar/angular';

import { HttpClientModule } from '@angular/common/http';
import { LoadComponent } from './load/load.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NobelliComponent,
    ClientsComponent,
    CalendarComponent,
    ProductsComponent,
    ExcelComponent,
    BandsComponent,
    LoadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    FullCalendarModule,
    MatAutocompleteModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTooltipModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
