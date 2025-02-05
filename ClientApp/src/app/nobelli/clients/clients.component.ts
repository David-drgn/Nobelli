import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/alert/alert.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { HttpServiceService } from 'src/app/services/http/http-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent {
  list: any;

  clientSelect: number = 0;

  constructor(
    private storage: StorageServiceService,
    private http: HttpServiceService,
    private dialog: MatDialog
  ) {
    this.getClient();
  }

  getClient() {
    this.storage.load.next(true);
    this.http.GET('clienteGet').subscribe(
      (res: any) => {
        this.storage.load.next(false);
        console.log(res);
        if (res.erro)
          this.openDialog(
            'Ops!',
            'Não conseguimos carregar os clientes agora. Por favor, tente novamente em instantes.',
            1
          );
        else {
          this.list = res.data;
        }
      },
      (erro: any) => {
        this.storage.load.next(false);
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

  lastDate(items: any) {
    if (items.length == 0) {
      return null;
    }

    let item = items.reduce((latest: any, current: any) =>
      current.data > latest.data ? current : latest
    );
    return item.data;
  }

  deleteClient(item: any) {
    this.dialog
      .open(ConfirmationComponent, {
        data: {
          title: 'Certeza que desejas deletar o cliente?',
          message: `Tem certeza mesmo que deseja excluir o cliente '${item.nome}' de seus clientes? Isto levará a exclusão de todos os dados referentes a ele`,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.storage.load.next(true);
          this.http.POST('clienteDelete', { id: item.id }).subscribe(
            (res) => {
              this.storage.load.next(false);
              if (res.erro)
                this.openDialog(
                  'Ops!',
                  'Ocorreu um erro ao deletar o cliente, por favor tente novamente mais tarde',
                  2
                );
              else {
                this.openDialog(
                  'Tudo certo',
                  'O cliente foi excluído com sucesso',
                  1
                );
                this.getClient();
              }
            },
            (erro) => {
              this.storage.load.next(false);
              this.openDialog(
                'Ops!',
                'Ocorreu um erro ao deletar o cliente, por favor tente novamente mais tarde',
                2
              );

              console.error(erro);
            }
          );
        } else this.openDialog('Tudo certo', 'A operação foi cancelada', 1);
      });
  }
}
