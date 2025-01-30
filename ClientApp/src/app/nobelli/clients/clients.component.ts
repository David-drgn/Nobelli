import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/alert/alert.component';
import { ClientAlertComponent } from 'src/app/client-alert/client-alert.component';
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
    private http: HttpServiceService,
    private dialog: MatDialog
  ) {
    this.getClient();
  }

  getClient() {
    this.http.GET('clienteGet').subscribe(
      (res: any) => {
        if (res.erro)
          this.openDialog(
            'Ops!',
            'Não conseguimos carregar os clientes agora. Por favor, tente novamente em instantes.',
            1
          );
        console.table(res);
      },
      (erro: any) => {
        this.openDialog(
          'Ops!',
          'Não conseguimos carregar os clientes agora. Por favor, tente novamente em instantes.',
          1
        );
        console.error(erro);
      }
    );
  }

  openDialog(title: string, message: string, status: number = 0): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        title,
        message,
        status,
      },
    });
  }

  openRegister(id: string = ''): void {
    const dialogRef = this.dialog.open(ClientAlertComponent, {
      data: {
        id,
      },
    });
  }
}
