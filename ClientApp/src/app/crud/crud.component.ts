import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpServiceService } from '../services/http/http-service.service';
import { StorageServiceService } from '../services/storage/storage-service.service';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

interface Section {
  title: string;
  valores: string[];
}

interface Client {
  nome: string;
  telefone: string;
  genero: string;
  cep: string;
  logradouro: string;
  uf: string;
  bairro: string;
  dataNasc: string;
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'],
})
export class CrudComponent {
  sections: Section[] = [];

  client: Client = {
    nome: '',
    telefone: '',
    genero: '',
    cep: '',
    logradouro: '',
    uf: '',
    bairro: '',
    dataNasc: '',
  };

  type: string | null;
  id: string | null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpServiceService,
    private storage: StorageServiceService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.type = this.route.snapshot.paramMap.get('type');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != '0') this.getClient();
  }

  addSection() {
    this.sections.push({
      title: '',
      valores: [''],
    });
  }

  removeSection(index: number) {
    this.sections.splice(index, 1);
  }

  addRow(index: number) {
    console.log(index);
    console.log(this.sections);
    this.sections[index].valores.push('');
  }

  removeRow(section: number, row: number) {
    console.log(section);
    console.log(row);
    this.sections[section].valores.splice(row, 1);
  }

  changeValueRow(section: number, row: number, value: string) {
    console.log(section);
    console.log(row);
    this.sections[section].valores[row] = value;
  }

  changeValueTitle(section: number, value: string) {
    console.log(section);
    this.sections[section].title = value;
  }

  cepChange(cepValue: string) {
    console.log(cepValue);
    const cepRegex = /^\d{5}-\d{3}$/;

    if (cepRegex.test(cepValue)) {
      this.storage.load.next(true);
      this.http.GETCEP(cepValue).subscribe(
        (res) => {
          if (res.erro)
            this.openDialog(
              'Ops!!',
              'Ocorreu um erro ao realizar a busca do CEP, verifique se ele é válido',
              1
            );
          else {
            this.client.logradouro = res.logradouro;
            this.client.uf = res.uf;
            this.client.bairro = res.bairro;
          }
          this.storage.load.next(false);
        },
        (erro) => {
          this.storage.load.next(false);
          console.error(erro);
        }
      );
    } else {
      this.client.logradouro = '';
      this.client.uf = '';
      this.client.bairro = '';
    }
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

  getClient() {
    this.storage.load.next(true);
    this.http.GET(`clienteGet/${this.id}`).subscribe(
      (res: any) => {
        this.storage.load.next(false);
        if (res.erro)
          this.openDialog(
            'Ops!',
            'Ocorreu um erro ao buscar o cliente, por favor tente novamente mais tarde',
            1
          );
        else {
          this.client = {
            nome: res.data[0].nome,
            telefone: res.data[0].telefone,
            genero: res.data[0].genero,
            cep: res.data[0].endereco,
            logradouro: '',
            uf: '',
            bairro: '',
            dataNasc: res.data[0].dataNasc,
          };

          this.sections = JSON.parse(res.data[0].descricao);

          console.log(JSON.parse(res.data[0].descricao));

          if (res.data[0].endereco)
            this.cepChange(
              res.data[0].endereco.slice(0, -3) +
                '-' +
                res.data[0].endereco.slice(-3)
            );
        }
      },
      (erro) => {
        this.openDialog(
          'Ops!',
          'Ocorreu um erro ao buscar o cliente, por favor tente novamente mais tarde',
          1
        );
        this.storage.load.next(false);
      }
    );
  }

  clientCrud() {
    if (!this.client.nome) {
      this.openDialog('Ops!', 'Por favor, preencha o nome do cliente', 2);
      return;
    }
    this.storage.load.next(true);
    this.http
      .POST(this.id == '0' ? 'clienteInsert' : 'clienteUpdate', {
        nome: this.client.nome,
        telefone: this.client.telefone,
        endereco: this.client.cep,
        descricao: JSON.stringify(this.sections),
        genero: this.client.genero,
        data_nasc: this.client.dataNasc,
        id: this.id,
      })
      .subscribe(
        (res) => {
          this.storage.load.next(false);
          if (res.erro)
            this.openDialog(
              'Opss!',
              this.id == '0'
                ? 'Ocorreu um erro ao cadastrar o cliente, tente novamente mais tarde'
                : 'Ocorreu um erro ao atualizar os dados do cliente, tente novamente daqui a pouco',
              1
            );
          else {
            this.openDialog(
              'Sucesso!',
              this.id == '0'
                ? 'Seu cliente foi cadastrado com sucesso'
                : 'Os dados do seu cliente foram atualizados com sucesso',
              2
            );
            this.router.navigate(['/nobelli/clients']);
          }
        },
        (erro) => {
          this.storage.load.next(false);
          console.error(erro);
          this.openDialog(
            'Opss!',
            this.id == '0'
              ? 'Ocorreu um erro ao cadastrar o cliente, tente novamente mais tarde'
              : 'Ocorreu um erro ao atualizar os dados do cliente, tente novamente daqui a pouco',
            1
          );
        }
      );
  }
}
