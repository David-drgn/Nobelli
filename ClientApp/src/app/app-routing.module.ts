import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { NobelliComponent } from "./nobelli/nobelli.component";
import { ClientsComponent } from "./nobelli/clients/clients.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "app",
    component: NobelliComponent,
    children: [{ path: "", component: ClientsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
