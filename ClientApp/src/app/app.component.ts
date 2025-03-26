import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Nobelli';

  theme: boolean = false;

  constructor(private renderer: Renderer2) {}

  dark() {
    this.renderer.addClass(document.body, 'dark-mode');
    this.renderer.removeClass(document.body, 'ligth-mode');
    this.theme = true;
  }
  
  ligth() {
    this.renderer.removeClass(document.body, 'dark-mode');
    this.renderer.addClass(document.body, 'ligth-mode');
    this.theme = false;
  }
}
