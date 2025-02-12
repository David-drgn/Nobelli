import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageServiceService } from '../storage/storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  urlBase: string = location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : 'https://nobelliapi.vercel.app';

  constructor(
    private httpClient: HttpClient,
    private storage: StorageServiceService
  ) {}

  POST<T = any>(
    api: string,
    body: any = {},
    responseType: 'json' | 'blob' = 'json'
  ) {
    body.token = this.storage.token.getValue();
    return this.httpClient.post<T>(`${this.urlBase}/api/${api}`, body, {
      responseType: responseType as any,
    });
  }

  GET<T = any>(api: string, body: any = {}) {
    body.token = this.storage.token.getValue();
    return this.httpClient.get<T>(`${this.urlBase}/api/${api}/${body.token}`);
  }

  GETCEP<T = any>(cep: string) {
    return this.httpClient.get<T>(`https://viacep.com.br/ws/${cep}/json/`);
  }
}
