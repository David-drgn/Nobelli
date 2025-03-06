import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NobelliComponent } from './nobelli/nobelli.component';
import { ClientsComponent } from './nobelli/clients/clients.component';
import { CalendarComponent } from './nobelli/calendar/calendar.component';
import { ProductsComponent } from './nobelli/products/products.component';
import { ExcelComponent } from './nobelli/excel/excel.component';
import { BandsComponent } from './nobelli/bands/bands.component';
import { CrudComponent } from './crud/crud.component';
import { ServicesComponent } from './nobelli/services/services.component';
import { CanActiveGuard } from './guards/can-active.guard';
import { ChatComponent } from './nobelli/chat/chat.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'nobelli',
    component: NobelliComponent,
    children: [
      { path: '', component: CalendarComponent, canActivate: [CanActiveGuard] },
      {
        path: 'crud/:type/:id',
        component: CrudComponent,
        canActivate: [CanActiveGuard],
      },
      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [CanActiveGuard],
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [CanActiveGuard],
      },
      {
        path: 'bands',
        component: BandsComponent,
        canActivate: [CanActiveGuard],
      },
      {
        path: 'service',
        component: ServicesComponent,
        canActivate: [CanActiveGuard],
      },
      {
        path: 'docs',
        component: ExcelComponent,
        canActivate: [CanActiveGuard],
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [CanActiveGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
