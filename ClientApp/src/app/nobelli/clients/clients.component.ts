import { Component } from "@angular/core";

@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.css"],
})
export class ClientsComponent {
  list = Array.from({ length: 1000 }, (_, index) => index + 1);

  clientSelect: number = 0;
}
