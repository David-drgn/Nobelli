import { Component } from '@angular/core';
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

interface Funcionario {
  nome: string;
  telefone: string;
  email: string;
}

interface SectionType {
  title: string;
  descricao: string;
}

interface Produto {
  title: string;
  descricao: string;
  valorcusto: string;
  valorvenda: string;
  qtd: number;
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

  funcionario: Funcionario = {
    nome: '',
    telefone: '',
    email: '',
  };

  sectionCreate: SectionType = {
    title: '',
    descricao: '',
  };

  produto: Produto = {
    title: '',
    descricao: '',
    valorcusto: '',
    valorvenda: '',
    qtd: 0,
  };

  type: string | null;
  sectionType: string | null = null;
  sectionId: string | null = null;
  id: string | null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpServiceService,
    private storage: StorageServiceService,
    private dialog: MatDialog
  ) {
    this.type = this.route.snapshot.paramMap.get('type');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.type?.includes('section')) {
      this.sectionType = this.type.split('@')[1];
      this.type = this.type.split('@')[0];
    }
    if (this.type?.includes('product') || this.type?.includes('estoque')) {
      this.sectionId = this.type.split('@')[1];
      this.type = this.type.split('@')[0];
      if (this.sectionId) this.getSection();
    }
    if (this.id != '0') {
      switch (this.type) {
        case 'client':
          this.getClient();
          break;
        case 'funcionario':
          this.getFuncionario();
          break;
        case 'section':
          this.getSection();
          break;
        case 'product':
          this.getProduct();
          break;
        case 'estoque':
          this.getProduct();
          break;

        default:
          break;
      }
    }
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

  getFuncionario() {
    this.storage.load.next(true);
    this.http.GET(`funcionarioGet/${this.id}`).subscribe(
      (res: any) => {
        this.storage.load.next(false);
        if (res.erro)
          this.openDialog(
            'Ops!',
            'Ocorreu um erro ao buscar o funcionário, por favor tente novamente mais tarde',
            1
          );
        else {
          this.funcionario = {
            nome: res.data[0].nome,
            telefone: res.data[0].telefone,
            email: res.data[0].email,
          };
        }
      },
      (erro) => {
        this.openDialog(
          'Ops!',
          'Ocorreu um erro ao buscar o funcionário, por favor tente novamente mais tarde',
          1
        );
        this.storage.load.next(false);
      }
    );
  }

  getSection() {
    this.storage.load.next(true);
    this.http
      .GET(
        `sectionGet/${
          this.type == 'product' || this.type == 'estoque'
            ? this.sectionId
            : this.id
        }`
      )
      .subscribe(
        (res: any) => {
          this.storage.load.next(false);
          if (res.erro)
            this.openDialog(
              'Ops!',
              'Ocorreu um erro ao buscar a seção, por favor tente novamente mais tarde',
              1
            );
          else {
            this.sectionCreate = {
              title: res.data[0].title,
              descricao: res.data[0].descricao,
            };
          }
        },
        (erro) => {
          this.openDialog(
            'Ops!',
            'Ocorreu um erro ao buscar a seção, por favor tente novamente mais tarde',
            1
          );
          this.storage.load.next(false);
        }
      );
  }

  getProduct() {
    this.storage.load.next(true);
    this.http.GET(`produtoGet/${this.id}`).subscribe(
      (res: any) => {
        this.storage.load.next(false);
        if (res.erro)
          this.openDialog(
            'Ops!',
            'Ocorreu um erro ao buscar o produto, por favor tente novamente mais tarde',
            1
          );
        else {
          this.produto = {
            title: res.data[0].title,
            valorcusto: res.data[0].valorcusto,
            valorvenda: res.data[0].valorvenda,
            descricao: res.data[0].descricao,
            qtd: res.data[0].qtd,
          };

          this.sectionCreate.title = res.data[0].section.title;
        }
      },
      (erro) => {
        this.openDialog(
          'Ops!',
          'Ocorreu um erro ao buscar o produto, por favor tente novamente mais tarde',
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
            window.history.back();
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

  funcionarioCrud() {
    if (!this.funcionario.nome) {
      this.openDialog('Ops!', 'Por favor, preencha o nome do funcionario', 2);
      return;
    }
    this.storage.load.next(true);
    this.http
      .POST(this.id == '0' ? 'funcionarioInsert' : 'funcionarioUpdate', {
        nome: this.funcionario.nome,
        telefone: this.funcionario.telefone,
        email: this.funcionario.email,
        id: this.id,
      })
      .subscribe(
        (res) => {
          this.storage.load.next(false);
          if (res.erro)
            this.openDialog(
              'Opss!',
              this.id == '0'
                ? 'Ocorreu um erro ao cadastrar o funcionário, tente novamente mais tarde'
                : 'Ocorreu um erro ao atualizar os dados do funcionário, tente novamente daqui a pouco',
              1
            );
          else {
            this.openDialog(
              'Sucesso!',
              this.id == '0'
                ? 'Seu funcionário foi cadastrado com sucesso'
                : 'Os dados do seu funcionário foram atualizados com sucesso',
              2
            );
            window.history.back();
          }
        },
        (erro) => {
          this.storage.load.next(false);
          console.error(erro);
          this.openDialog(
            'Opss!',
            this.id == '0'
              ? 'Ocorreu um erro ao cadastrar o funcionário, tente novamente mais tarde'
              : 'Ocorreu um erro ao atualizar os dados do funcionário, tente novamente daqui a pouco',
            1
          );
        }
      );
  }

  sectionCrud() {
    if (!this.sectionCreate.title) {
      this.openDialog('Ops!', 'Por favor, preencha o nome da seção', 2);
      console.log(this.sectionCreate.descricao);
      return;
    }
    this.storage.load.next(true);
    this.http
      .POST(this.id == '0' ? 'sectionInsert' : 'sectionUpdate', {
        title: this.sectionCreate.title,
        descricao: this.sectionCreate.descricao,
        tipo: this.sectionType?.toLowerCase(),
        id: this.id,
      })
      .subscribe(
        (res) => {
          this.storage.load.next(false);
          if (res.erro)
            this.openDialog(
              'Opss!',
              this.id == '0'
                ? 'Ocorreu um erro ao cadastrar a seção, tente novamente mais tarde'
                : 'Ocorreu um erro ao atualizar os dados da seção, tente novamente daqui a pouco',
              1
            );
          else {
            this.openDialog(
              'Sucesso!',
              this.id == '0'
                ? 'Sua seção foi cadastrado com sucesso'
                : 'Os dados do sua seção foram atualizados com sucesso',
              2
            );
            window.history.back();
          }
        },
        (erro) => {
          this.storage.load.next(false);
          console.error(erro);
          this.openDialog(
            'Opss!',
            this.id == '0'
              ? 'Ocorreu um erro ao cadastrar a seção, tente novamente mais tarde'
              : 'Ocorreu um erro ao atualizar os dados da seção, tente novamente daqui a pouco',
            1
          );
        }
      );
  }

  produtoCrud() {
    if (!this.produto.title) {
      this.openDialog('Ops!', 'Por favor, preencha o nome do produto', 2);
      return;
    }
    this.storage.load.next(true);
    this.http
      .POST(this.id == '0' ? 'produtoInsert' : 'produtoUpdate', {
        title: this.produto.title,
        descricao: this.produto.descricao,
        section_id: this.sectionId,
        valorcusto: this.produto.valorcusto,
        valorvenda: this.produto.valorvenda,
        qtd: this.produto.qtd,
        id: this.id,
      })
      .subscribe(
        (res) => {
          this.storage.load.next(false);
          if (res.erro)
            this.openDialog(
              'Opss!',
              this.id == '0'
                ? 'Ocorreu um erro ao cadastrar o produto, tente novamente mais tarde'
                : 'Ocorreu um erro ao atualizar os dados do produto, tente novamente daqui a pouco',
              1
            );
          else {
            this.openDialog(
              'Sucesso!',
              this.id == '0'
                ? 'Seu produto foi cadastrado com sucesso'
                : 'Os dados do seu produto foram atualizados com sucesso',
              2
            );
            window.history.back();
          }
        },
        (erro) => {
          this.storage.load.next(false);
          console.error(erro);
          this.openDialog(
            'Opss!',
            this.id == '0'
              ? 'Ocorreu um erro ao cadastrar o produto, tente novamente mais tarde'
              : 'Ocorreu um erro ao atualizar os dados do produto, tente novamente daqui a pouco',
            1
          );
        }
      );
  }
}
