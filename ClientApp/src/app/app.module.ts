import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { HttpClientModule } from '@angular/common/http';
import { LoadComponent } from './load/load.component';
import { AlertComponent } from './alert/alert.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CrudComponent } from './crud/crud.component';
import { ServicesComponent } from './nobelli/services/services.component';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ConfirmationComponent } from './confirmation/confirmation.component';

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
    AlertComponent,
    CrudComponent,
    ServicesComponent,
    ConfirmationComponent,
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
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule,
    MatSelectModule,
    MatTooltipModule,
    HttpClientModule,
    MatStepperModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideNgxMask(),
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
