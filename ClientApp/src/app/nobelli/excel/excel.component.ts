import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http/http-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';

interface Cliente {
  all: boolean;
  nome: boolean;
  telefone: boolean;
  endereco: boolean;
  descricao: boolean;
  genero: boolean;
  data_nasc: boolean;
}

interface Funcionario {
  all: boolean;
  nome: boolean;
  telefone: boolean;
  email: boolean;
}

interface Produtos {
  all: boolean;
  title: boolean;
  descricao: boolean;
  valor_custo: boolean;
  valor_venda: boolean;
  qtd: boolean;
}

interface Estoque {
  all: boolean;
  nome: boolean;
  descricao: boolean;
  valorcusto: boolean;
  valorvenda: boolean;
  qtd: boolean;
}

interface Servico {
  all: boolean;
  title: boolean;
  descricao: boolean;
  valor: boolean;
  duracao: boolean;
}

interface Eventos {
  all: boolean;
  cliente_id: boolean;
  funcionario_id: boolean;
  servico_id: boolean;
  horario: boolean;
  datainicio: boolean;
  datafim: boolean;
  semanal: boolean;
}

interface Vendas {
  all: boolean;
  cliente_id: boolean;
  funcionario_id: boolean;
  valortotal: boolean;
  produtos: boolean;
  data: boolean;
}

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css'],
})
export class ExcelComponent {
  cliente: Cliente = {
    all: false,
    nome: false,
    telefone: false,
    endereco: false,
    descricao: false,
    genero: false,
    data_nasc: false,
  };

  funcionario: Funcionario = {
    all: false,
    nome: false,
    telefone: false,
    email: false,
  };

  produtos: Produtos = {
    all: false,
    title: false,
    descricao: false,
    valor_custo: false,
    valor_venda: false,
    qtd: false,
  };

  estoque: Estoque = {
    all: false,
    nome: false,
    descricao: false,
    valorcusto: false,
    valorvenda: false,
    qtd: false,
  };

  servico: Servico = {
    all: false,
    title: false,
    descricao: false,
    valor: false,
    duracao: false,
  };

  eventos: Eventos = {
    all: false,
    cliente_id: false,
    funcionario_id: false,
    servico_id: false,
    horario: false,
    datainicio: false,
    datafim: false,
    semanal: false,
  };

  vendas: Vendas = {
    all: false,
    cliente_id: false,
    funcionario_id: false,
    valortotal: false,
    produtos: false,
    data: false,
  };

  constructor(
    private http: HttpServiceService,
    private storage: StorageServiceService
  ) {}

  createExcel(only: string = '') {
    this.storage.load.next(true);
    this.http
      .POST(
        'excel/create',
        {
          cliente: only == 'cliente' || only == '' ? this.cliente : {},
          funcionario:
            only == 'funcionario' || only == '' ? this.funcionario : {},
          produtos: only == 'produtos' || only == '' ? this.produtos : {},
          estoque: only == 'estoque' || only == '' ? this.estoque : {},
          servico: only == 'servico' || only == '' ? this.servico : {},
          eventos: only == 'eventos' || only == '' ? this.eventos : {},
          vendas: only == 'vendas' || only == '' ? this.vendas : {},
        },
        'blob'
      )
      .subscribe(
        (res: Blob) => {
          this.storage.load.next(false);
          const blob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = only != '' ? `${only}_dados.xlsx` : 'dados.xlsx';
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        (erro) => {
          this.storage.load.next(false);
          console.log(erro);
        }
      );
  }
}
