import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NobelliComponent } from './nobelli/nobelli.component';
import { ClientsComponent } from './nobelli/clients/clients.component';
import { CalendarComponent } from './nobelli/calendar/calendar.component';
import { ProductsComponent } from './nobelli/products/products.component';
import { ExcelComponent } from './nobelli/excel/excel.component';
import { BandsComponent } from './nobelli/bands/bands.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'nobelli',
    component: NobelliComponent,
    children: [
      { path: '', component: CalendarComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'bands', component: BandsComponent },
      { path: 'docs', component: ExcelComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
