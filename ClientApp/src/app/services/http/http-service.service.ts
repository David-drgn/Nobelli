import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageServiceService } from '../storage/storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  urlBase: string = location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : '';

  constructor(
    private httpClient: HttpClient,
    private storage: StorageServiceService
  ) {}

  POST<T = any>(api: string, body: any = {}) {
    body.token = this.storage.token.getValue();
    return this.httpClient.post<T>(`${this.urlBase}/api/${api}`, body);
  }

  GET<T = any>(api: string, body: any = {}) {
    body.token = this.storage.token.getValue();
    return this.httpClient.get<T>(`${this.urlBase}/api/${api}`, body);
  }
}
