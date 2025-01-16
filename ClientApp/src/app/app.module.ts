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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NobelliComponent,
    ClientsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
