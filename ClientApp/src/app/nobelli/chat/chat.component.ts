import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/alert/alert.component';
import { HttpServiceService } from 'src/app/services/http/http-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';

interface Contents {
  contents: ChatMessage[];
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    standalone: false
})
export class ChatComponent {
  history: Contents;

  message: string = '';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private storage: StorageServiceService,
    private http: HttpServiceService,
    private dialog: MatDialog
  ) {
    this.history = this.storage.chatHistory.getValue();
  }

  private scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erro ao rolar o chat:', err);
    }
  }

  chatQuest() {
    if (this.message == '') {
      this.openDialog('Opps!', 'Por favor realize uma pergunta');
      return;
    }

    this.storage.load.next(true);

    this.history.contents.push({
      role: 'user',
      parts: [{ text: this.message }],
    });

    this.http.POST('chat', { history: this.history }).subscribe(
      (res: any) => {
        this.storage.load.next(false);
        console.log(res);
        this.message = '';
        if (res.erro) {
          this.openDialog(
            'Ops!',
            'Não conseguimos realizar a conexão com o chat',
            1
          );
          this.history.contents.push({
            role: 'model',
            parts: [
              {
                text: 'Aparentemente, algo deu errado, por favor, tente novamente mais tarde',
              },
            ],
          });
          this.scrollToBottom();
        } else {
          this.history.contents.push({
            role: 'model',
            parts: [{ text: res.mensagem }],
          });
          this.scrollToBottom();
        }
      },
      (erro: any) => {
        this.storage.load.next(false);
        this.openDialog(
          'Ops!',
          'Não conseguimos realizar a conexão com o chat',
          1
        );
        this.history.contents.push({
          role: 'model',
          parts: [
            {
              text: 'Aparentemente, algo deu errado, por favor, tente novamente mais tarde',
            },
          ],
        });
        this.scrollToBottom();
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
}
