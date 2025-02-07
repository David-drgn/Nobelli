import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highLigth',
})
export class HighLigthPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, search: string, color: string = '#df9c73'): SafeHtml {
    if (value == null) return '';
    const stringValue = typeof value === 'string' ? value : String(value);

    if (!search) return stringValue;

    const escapedSearch = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(escapedSearch, 'gi');

    const highlightedText = stringValue.replace(
      regex,
      (match) =>
        `<span style="color: ${color}; font-weight: bold;">${match}</span>`
    );

    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}
