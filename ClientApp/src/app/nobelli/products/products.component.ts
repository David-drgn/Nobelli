import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { AlertComponent } from 'src/app/alert/alert.component';
import { ConfirmationComponent } from 'src/app/confirmation/confirmation.component';
import { HttpServiceService } from 'src/app/services/http/http-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  list: any[] = [];
  search: string;

  constructor(
    private http: HttpServiceService,
    private storage: StorageServiceService,
    private dialog: MatDialog
  ) {
    this.search = this.storage.search.getValue();
    this.storage.search.pipe(debounceTime(800)).subscribe((searchText) => {
      this.storage.load.next(true);
      setTimeout(() => {
        this.storage.load.next(false);
        this.search = searchText;
      }, 1000);
    });
    this.getProdutos();
  }

  getProdutos() {
    this.storage.load.next(true);
    this.http.GET('sectionGet').subscribe(
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

  returnProdItem(item: any): string {
    return `product@${item.id}`;
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

  produtosFilter(sections: any): any[] {
    return sections.filter((e: any) => e.tipo == 'produto');
  }

  estoqueFilter(sections: any): any[] {
    return sections.filter((e: any) => e.tipo == 'estoque');
  }

  produtosItemFilter(produtos: any): any[] {
    if (this.search)
      return produtos.filter(
        (e: any) =>
          (e.title?.toLowerCase().includes(this.search.toLowerCase()) ||
            e.qtd
              ?.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            e.valorcusto
              ?.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())) ??
          false
      );
    else return produtos;
  }

  estoqueItemFilter(produtos: any): any[] {
    if (this.search)
      return produtos.filter(
        (e: any) =>
          (e.title?.toLowerCase().includes(this.search.toLowerCase()) ||
            e.qtd
              ?.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            e.valorcusto
              ?.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            e.valorvenda
              ?.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())) ??
          false
      );
    else return produtos;
  }

  deleteSection(item: any) {
    this.dialog
      .open(ConfirmationComponent, {
        data: {
          title: 'Certeza que desejas deletar a seção?',
          message: `Tem certeza mesmo que deseja excluir a seção '${item.title}'? Isto levará a exclusão de todos os dados referentes a ela`,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.storage.load.next(true);
          this.http.POST('sectionDelete', { id: item.id }).subscribe(
            (res) => {
              this.storage.load.next(false);
              if (res.erro)
                this.openDialog(
                  'Ops!',
                  'Ocorreu um erro ao deletar a seção, por favor tente novamente mais tarde',
                  2
                );
              else {
                this.openDialog(
                  'Tudo certo',
                  'A seção foi excluído com sucesso',
                  1
                );
                this.getProdutos();
              }
            },
            (erro) => {
              this.storage.load.next(false);
              this.openDialog(
                'Ops!',
                'Ocorreu um erro ao deletar a seção, por favor tente novamente mais tarde',
                2
              );

              console.error(erro);
            }
          );
        } else this.openDialog('Tudo certo', 'A operação foi cancelada', 1);
      });
  }

  deleteProduto(item: any) {
    this.dialog
      .open(ConfirmationComponent, {
        data: {
          title: 'Certeza que desejas deletar o produto?',
          message: `Tem certeza mesmo que deseja excluir o produto '${item.title}'? Isto levará a exclusão de todos os dados referentes a ele`,
        },
        disableClose: true,
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.storage.load.next(true);
          this.http.POST('produtoDelete', { id: item.id }).subscribe(
            (res) => {
              this.storage.load.next(false);
              if (res.erro)
                this.openDialog(
                  'Ops!',
                  'Ocorreu um erro ao deletar o produto, por favor tente novamente mais tarde',
                  2
                );
              else {
                this.openDialog(
                  'Tudo certo',
                  'O produto foi excluído com sucesso',
                  1
                );
                this.getProdutos();
              }
            },
            (erro) => {
              this.storage.load.next(false);
              this.openDialog(
                'Ops!',
                'Ocorreu um erro ao deletar o produto, por favor tente novamente mais tarde',
                2
              );

              console.error(erro);
            }
          );
        } else this.openDialog('Tudo certo', 'A operação foi cancelada', 1);
      });
  }
}
