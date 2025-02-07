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

  calendarOptions: CalendarOptions = {
    initialView: this.calendarView,
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    weekends: true,
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
    eventClick: (info) => {
      // this.dialog.open(AgendaComponent, {
      //   data: {
      //     id: info.event.id,
      //   },
      // });
    },
  };

  constructor(
    private storage: StorageServiceService,
    private dialog: MatDialog
  ) {
    // this.storage.search.subscribe((searchText) => {
    //   this.storage.load.next(true);
    //   setTimeout(() => {
    //     this.storage.load.next(false);
    //   }, 1000);
    // });
  }

  ngAfterViewInit() {
    if (this.calendar) {
      this.calendar.forEach((element) => {
        this.calendarObj = new Calendar(
          element.nativeElement,
          this.calendarOptions
        );
      });
      this.calendarObj.render();
      // this.storage.events.subscribe((value) => {
      //   if (this.calendarObj.getEvents())
      //     this.calendarObj.getEvents().forEach((element) => {
      //       element.remove();
      //     });

      //   if (value)
      //     value.forEach((element: any) => {
      //       this.calendarObj.addEvent(element);
      //     });
      // });
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
}
