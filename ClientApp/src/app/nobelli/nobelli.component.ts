import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageServiceService } from '../services/storage/storage-service.service';

@Component({
  selector: 'app-nobelli',
  templateUrl: './nobelli.component.html',
  styleUrls: ['./nobelli.component.css'],
})
export class NobelliComponent {
  open: boolean = true;
  pathSelect: string = '';
  load: boolean = false;

  constructor(private router: Router, private storage: StorageServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.pathSelect = event.url;
        console.log(this.pathSelect);
      }
    });

    this.storage.load.subscribe((loader) => {
      console.log(loader);
      this.load = loader;
    });
  }

  search(text: string) {
    this.storage.search.next(text);
  }
}
