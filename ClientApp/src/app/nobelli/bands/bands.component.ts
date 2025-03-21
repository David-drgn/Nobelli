import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/alert/alert.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { HttpServiceService } from 'src/app/services/http/http-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';

@Component({
    selector: 'app-bands',
    templateUrl: './bands.component.html',
    styleUrls: ['./bands.component.css'],
    standalone: false
})
export class BandsComponent {
  list: any[] = [];
  search: string;

  constructor(
    private http: HttpServiceService,
    private storage: StorageServiceService,
    private dialog: MatDialog
  ) {
    this.search = this.storage.search.getValue();
    this.storage.search.subscribe((searchText) => {
      this.storage.load.next(true);
      setTimeout(() => {
        this.storage.load.next(false);
        this.search = searchText;
      }, 1000);
    });
    this.getBands();
  }

  getBands() {
    this.storage.load.next(true);
    this.http.GET('bandGet').subscribe(
      (res: any) => {
        this.storage.load.next(false);
        console.log(res);
        if (res.erro)
          this.openDialog(
            'Ops!',
            'Não conseguimos carregar os produtos agora. Por favor, tente novamente em instantes.',
            1
          );
        else {
          this.list = res.data;
          console.log(this.list);
        }
      },
      (erro: any) => {
        this.storage.load.next(false);
        this.openDialog(
          'Ops!',
          'Não conseguimos carregar os produtos agora. Por favor, tente novamente em instantes.',
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

  deleteVenda(item: any) {
    this.dialog
          .open(ConfirmationComponent, {
            data: {
              title: 'Certeza que desejas deletar a venda?',
              message: `Tem certeza mesmo que deseja excluir a venda? Isto levará a exclusão de todos os dados referentes a ele`,
            },
            disableClose: true,
          })
          .afterClosed()
          .subscribe((response) => {
            if (response) {
              this.storage.load.next(true);
              this.http.POST('bandDelete', { id: item.id }).subscribe(
                (res) => {
                  this.storage.load.next(false);
                  if (res.erro)
                    this.openDialog(
                      'Ops!',
                      'Ocorreu um erro ao deletar a venda, por favor tente novamente mais tarde',
                      2
                    );
                  else {
                    this.openDialog(
                      'Tudo certo',
                      'A venda foi excluído com sucesso',
                      1
                    );
                    this.getBands();
                  }
                },
                (erro) => {
                  this.storage.load.next(false);
                  this.openDialog(
                    'Ops!',
                    'Ocorreu um erro ao deletar a venda, por favor tente novamente mais tarde',
                    2
                  );
    
                  console.error(erro);
                }
              );
            } else this.openDialog('Tudo certo', 'A operação foi cancelada', 1);
          });
  }

  vendaItemFilter(vendas: any): any[] {
    if (this.search)
      return vendas.filter(
        (e: any) =>
          (e.cliente.nome?.toLowerCase().includes(this.search.toLowerCase()) ||
            e.data
              ?.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            e.valortotal
              ?.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())) ??
          false
      );
    else return vendas;
  }
}
