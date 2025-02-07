import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyMask',
})
export class CurrencyMaskPipe implements PipeTransform {
  transform(value: any, decimalPlaces: number = 2): string {
    if (value == null) return '';

    // Converte para número
    let numberValue = parseFloat(value);
    if (isNaN(numberValue)) return '';

    // Formata o número com separador de milhares e casas decimais
    return `R$ ${numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })}`;
  }
}
