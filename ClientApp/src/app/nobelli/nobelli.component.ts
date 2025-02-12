import { Component, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageServiceService } from '../services/storage/storage-service.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-nobelli',
  templateUrl: './nobelli.component.html',
  styleUrls: ['./nobelli.component.css'],
})
export class NobelliComponent {
  open: boolean = true;
  pathSelect: string = '';
  load: boolean = false;

  screenWidth: number = window.innerWidth;

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private router: Router, private storage: StorageServiceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.pathSelect = event.url;
      }
    });

    this.storage.load.subscribe((loader) => {
      this.load = loader;
    });
  }

  ngAfterViewInit() {
    if (this.screenWidth > 600) {
      this.drawer.open();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 600) {
      this.drawer.open();
    } else {
      this.drawer.close();
    }
  }

  search(text: string) {
    this.storage.search.next(text);
  }

  toggleDrawer() {
    if (this.screenWidth <= 600) this.drawer.toggle();
  }

  logout() {
    this.storage.token.next(null);
    this.router.navigate(['/']);
  }
}
