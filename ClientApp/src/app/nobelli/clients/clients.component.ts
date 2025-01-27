import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http/http-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent {
  list = Array.from({ length: 1000 }, (_, index) => index + 1);

  clientSelect: number = 0;

  constructor(
    private storage: StorageServiceService,
    private http: HttpServiceService
  ) {
    this.http.GET('userGet').subscribe((res) => {
      console.table(res);
    });
  }
}
