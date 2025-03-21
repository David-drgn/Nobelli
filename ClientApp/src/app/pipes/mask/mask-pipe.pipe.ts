import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskPipe',
    standalone: false
})
export class MaskPipePipe implements PipeTransform {
  transform(value: string, pattern: string): string {
    if (!value) return '';

    let maskedValue = '';
    let valueIndex = 0;

    for (let char of pattern) {
      if (char === '0' && value[valueIndex]) {
        maskedValue += value[valueIndex];
        valueIndex++;
      } else if (char !== '0') {
        maskedValue += char;
      }
    }
    return maskedValue;
  }
}
