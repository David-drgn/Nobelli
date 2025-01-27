import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageServiceService {
  token = new BehaviorSubject<any>(null);
  load = new BehaviorSubject<boolean>(false);

  search = new BehaviorSubject<string>('');

  constructor() {
    this.token.next(localStorage.getItem('token'));
    this.token.subscribe((value) => {
      value
        ? localStorage.setItem('token', value)
        : localStorage.removeItem('token');
    });
  }
}
