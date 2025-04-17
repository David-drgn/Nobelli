import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';
import { debounceTime } from 'rxjs';
import { AlertComponent } from 'src/app/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http/http-service.service';

import { addDays, format, isBefore } from 'date-fns';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  viewCalendar: number = 1;
  calendarView: string = 'dayGridMonth';
  @ViewChildren('calendar') calendar!: QueryList<ElementRef>;
  calendarObj!: Calendar;
  list: any;

  calendarOptions: CalendarOptions = {
    initialView: this.calendarView,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    weekends: true,
    eventDidMount: (info) => {
      const tooltip = info.event.extendedProps['titleTooltip'];
      if (tooltip) {
        info.el.setAttribute('title', tooltip);
      }
    },
    customButtons: {
      view: {
        text: 'Trocar visualização',
        click: () => {
          this.changeCalendarView();
        },
      },
      today: {
        text: 'Hoje',
        click: () => {
          this.calendarObj.today();
        },
      },
      prox: {
        text: 'Próximo',
        icon: 'chevron-right',
        click: () => {
          this.calendarObj.next();
        },
      },
      ant: {
        text: 'Anterior',
        icon: 'chevron-left',
        click: () => {
          this.calendarObj.prev();
        },
      },
    },
    locale: 'pt-br',
    selectable: true,
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'ant today prox view',
    },
    // events: [
    //   {
    //     title:
    //       'Adriana Carmona de Almeida Ferreira - Massagem com pedras quentes e Ilib ',
    //     start: '2025-04-29T04:23:00',
    //     end: '2025-04-29T05:53:00',
    //     allDay: false,
    //     backgroundColor: '#66bb6a',
    //     extendedProps: {
    //       cliente: {
    //         id: 'fe1278b5-2d4d-4dfc-9d01-47be0cd5ca0f',
    //         nome: 'Adriana Carmona de Almeida Ferreira',
    //         genero: 'Feminino',
    //         endereco: '',
    //         telefone: '11987305327',
    //         data_nasc: '1978-06-12',
    //         descricao:
    //           '[{"title":"Antigas Sessões Beth","valores":["26/06 - DLM","03/07 - DLM"," 10/07 - DLM","31/07 - DLM + H2 + ilib ","07/08 - DLM + H2 + ilib ","21/08 - DLM + H2 + ilib "," 27/08 - DLM + H2 + ilib","21/03/2025 - Biorressonancia ","25/03/2025 - H2 + ILIB + Detox + Peeling "]},{"title":"Antigas Sessões Ira","valores":[" 19/11/2024 - MAF ","26/11/2024 - MAF com Detox ","10/12/2024 - Tração ","18/12/2024 - Mc. MAF com detox ","21/03/2025 - Biorressonancia "]},{"title":"Exames anteriores","valores":["Sangue de 2024"]},{"title":"Medicamentos","valores":["Toma Dafron"]},{"title":"Compras ","valores":["Complex Nutri - R$190 - falta pagar ","Serenidade Pet - R$136 (pago)","Balsamo Pet 136 - R$136 - falta pagar ","Própolis vermelho - falta pagar "]}]',
    //         created_at: '2025-02-06T13:11:58.455041',
    //       },
    //       funcionario: {
    //         id: 'f0a5498e-6c49-441f-be31-6528b1628276',
    //         nome: 'Elizabeth Pinotti',
    //         email: '',
    //         telefone: '',
    //         created_at: '2025-02-11T13:49:36.973654',
    //       },
    //       servico: {
    //         id: 'd40580b2-e9e1-4d5f-8164-8da8ff6722c4',
    //         title: 'Massagem com pedras quentes e Ilib ',
    //         valor: 180,
    //         duracao: '01:30',
    //         descricao: '',
    //         section_id: '777acebe-c29c-487e-afab-a47462ab95a6',
    //       },
    //     },
    //   },
    // ],
    eventClick: (info) => {
      // this.dialog.open(AgendaComponent, {
      //   data: {
      //     id: info.event.id,
      //   },
      // });
    },
    dateClick: (info) => {
      console.table(info);
      this.storage.infoSection.next(info);
      this.router.navigate(['/nobelli/crud', 'event', 0]);
    },
  };

  constructor(
    private storage: StorageServiceService,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpServiceService
  ) {}

  ngAfterViewInit() {
    if (this.calendar) {
      this.calendar.forEach((element) => {
        this.calendarObj = new Calendar(
          element.nativeElement,
          this.calendarOptions
        );
      });
      this.calendarObj.render();

      this.getEvents();
    }
  }

  private changeCalendarView() {
    switch (this.viewCalendar) {
      case 0:
        this.calendarView = 'dayGridMonth';
        break;
      case 1:
        this.calendarView = 'timeGridWeek';
        break;
      case 2:
        this.calendarView = 'listWeek';
        break;
      case 3:
        this.calendarView = 'dayGridWeek';
        break;
      case 4:
        this.calendarView = 'timeGridDay';
        this.viewCalendar = -1;
        break;
    }
    this.viewCalendar++;
    this.calendarObj.changeView(this.calendarView);
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

  getEvents() {
    this.storage.load.next(true);
    this.http.GET('eventGet').subscribe(
      (res: any) => {
        this.storage.load.next(false);
        console.log(res);
        if (res.erro)
          this.openDialog(
            'Ops!',
            'Não conseguimos carregar os eventos agora. Por favor, tente novamente em instantes.',
            1
          );
        else {
          this.list = res.data;

          // if (this.calendarObj.getEvents())
          //   this.calendarObj.getEvents().forEach((element) => {
          //     element.remove();
          //   });

          this.list.forEach((e: any) => {
            const eventosDoCliente = this.gerarEventosSemanais(e);
            console.log(eventosDoCliente);
            eventosDoCliente.forEach((evento) => {
              this.calendarObj.addEvent(evento);
            });
          });
        }
      },
      (erro: any) => {
        this.storage.load.next(false);
        this.openDialog(
          'Ops!',
          'Não conseguimos carregar os eventos agora. Por favor, tente novamente em instantes.',
          1
        );
        console.error(erro);
      }
    );
  }

  diasSemanaMap: Record<string, number> = {
    Domingo: 0,
    Segunda: 1,
    Terça: 2,
    Quarta: 3,
    Quinta: 4,
    Sexta: 5,
    Sábado: 6,
  };

  gerarEventosSemanais(agendamento: any): any[] {
    const eventos = [];

    const dataInicio = addDays(new Date(agendamento.datainicio), 1);
    const dataFim = addDays(new Date(agendamento.datafim), 1);
    const diasSelecionados = agendamento.semanal.map(
      (d: string) => this.diasSemanaMap[d]
    );

    // Zerando as horas para evitar problema na comparação
    dataInicio.setHours(0, 0, 0, 0);
    dataFim.setHours(0, 0, 0, 0);

    let dataAtual = new Date(dataInicio);

    while (dataAtual <= dataFim) {
      const diaSemana = dataAtual.getDay();

      if (
        agendamento.semanal.length === 0 ||
        diasSelecionados.includes(diaSemana)
      ) {
        const dataStr = format(dataAtual, 'yyyy-MM-dd');
        const start = `${dataStr}T${agendamento.horarioInicio}`;
        const end = `${dataStr}T${agendamento.horarioTermino}`;

        eventos.push({
          title: `${agendamento.cliente.nome} - ${agendamento.servico.title}`,
          start,
          end,
          allDay: false,
          extendedProps: {
            cliente: agendamento.cliente,
            funcionario: agendamento.funcionario,
            servico: agendamento.servico,
          },
          titleTooltip: `Cliente: ${agendamento.cliente.nome}\nServiço: ${agendamento.servico.title}\nInício: ${agendamento.horarioInicio}`,
        });
      }

      dataAtual = addDays(dataAtual, 1);
    }

    return eventos;
  }
}
