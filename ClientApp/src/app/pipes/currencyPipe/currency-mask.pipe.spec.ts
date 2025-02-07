import { CurrencyMaskPipe } from './currency-mask.pipe';

describe('CurrencyMaskPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencyMaskPipe();
    expect(pipe).toBeTruthy();
  });
});
