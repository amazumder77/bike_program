import { createSortOption, selectSortOption } from '../check-sort';

describe('SortOption', () => {
  it.each([
    ['-fieldName', 'DESC'],
    ['+fieldName', 'ASC'],
    [':fieldName', 'ASC'],
    ['fieldName', 'ASC'],
    ['', 'ASC'],
  ])('should select sort option', (value, expected) => {
    const result = selectSortOption(value);
    expect(result).toEqual(expected);
  });

  it.each([
    ['-fieldName', { ['fieldName']: 'DESC' }],
    ['fieldName', { ['fieldName']: 'ASC' }],
  ])('should create sort option', (value, expected) => {
    const result = createSortOption(value);
    expect(result).toEqual(expected);
  });
});
