import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Contents {
  contents: ChatMessage[];
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class StorageServiceService {
  token = new BehaviorSubject<any>(null);
  load = new BehaviorSubject<boolean>(false);

  search = new BehaviorSubject<string>('');
  infoSection = new BehaviorSubject<any>(null);
  
  theme = new BehaviorSubject<string | null>(null);

  chatHistory = new BehaviorSubject<Contents>({
    contents: [
      {
        role: 'model',
        parts: [
          {
            text: 'Olá, eu sou a assistente virtual da Nobelli, no que posso ajudar?',
          },
        ],
      },
    ],
  });

  constructor() {
    this.token.next(localStorage.getItem('token'));
    this.token.subscribe((value) => {
      value
        ? localStorage.setItem('token', value)
        : localStorage.removeItem('token');
    });

    this.theme.next(localStorage.getItem('theme'));
    this.theme.subscribe((value) => {
      value
        ? localStorage.setItem('theme', value)
        : localStorage.removeItem('theme');
    });
  }
}
