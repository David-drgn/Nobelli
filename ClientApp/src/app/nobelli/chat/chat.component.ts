import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/alert/alert.component';
import { HttpServiceService } from 'src/app/services/http/http-service.service';
import { StorageServiceService } from 'src/app/services/storage/storage-service.service';

interface Contents {
  contents: ChatMessage[];
}

interface Files {
  data: string;
  mimeType: string;
  name: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: Files }[];
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  history: Contents;
  fileSet: Files[] = [];

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

  fileChange(event: any) {
    const input = event.target as HTMLInputElement;
    this.fileSet = [];
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];

        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result as string;

          this.fileSet.push({
            name: file.name,
            mimeType: base64String.split(';')[0].replace('data:', ''),
            data: base64String.split(',')[1],
          });
        };

        reader.onerror = (error) => {
          console.error('Erro ao ler o arquivo:', error);
        };

        reader.readAsDataURL(file);
      }
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

    for (let i = 0; i < this.fileSet.length; i++) {
      const file = this.fileSet[i];
      this.history.contents.push({
        role: 'user',
        parts: [{ inlineData: file }],
      });
    }

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
