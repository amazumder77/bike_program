import { standardizeLocale } from '../locale-utils';

describe('standardizeLocale', () => {
  it('should standardize locale', () => {
    expect(standardizeLocale('en-us')).toBe('en_US');
    expect(standardizeLocale('en-US')).toBe('en_US');
    expect(standardizeLocale('EN-en')).toBe('en_EN');
    expect(standardizeLocale('EN-EN')).toBe('en_EN');
    expect(standardizeLocale('en_us')).toBe('en_US');
    expect(standardizeLocale('en_US')).toBe('en_US');
    expect(standardizeLocale('EN_en')).toBe('en_EN');
    expect(standardizeLocale('EN_EN')).toBe('en_EN');
    expect(standardizeLocale('test')).toBe('test');
    expect(standardizeLocale(null)).toBe(null);
  });
});
