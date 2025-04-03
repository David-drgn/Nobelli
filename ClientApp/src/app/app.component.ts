import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { StorageServiceService } from './services/storage/storage-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Nobelli';

  theme: boolean = false;

  constructor(
    private renderer: Renderer2,
    private storage: StorageServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    if (this.storage.theme.getValue() == 'dark') this.dark();
    this.cdr.detectChanges();
  }

  dark() {
    this.renderer.addClass(document.body, 'dark-mode');
    this.renderer.removeClass(document.body, 'ligth-mode');
    this.theme = true;

    this.storage.theme.next('dark');
  }

  ligth() {
    this.renderer.removeClass(document.body, 'dark-mode');
    this.renderer.addClass(document.body, 'ligth-mode');
    this.theme = false;

    this.storage.theme.next('light');
  }
}
