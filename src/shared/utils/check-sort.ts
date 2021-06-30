/* eslint-disable no-shadow */
enum SORT_OPTIONS {
  ASC = 'ASC',
  DESC = 'DESC',
}

const DESC_SYMBOL = '-';

/**
 * Select whether to sort ascending or descending based on the parameter in form '-fieldName' or 'fieldName'
 */
export const selectSortOption = (value: string): SORT_OPTIONS =>
  value.charAt(0) === DESC_SYMBOL ? SORT_OPTIONS.DESC : SORT_OPTIONS.ASC;

/**
 * Create an object to be used in a typeorm query for the order parameter in form { [fieldName]: ASC }
 */
export const createSortOption = (value: string): any => {
  return { [value.replace('-', '')]: selectSortOption(value) };
};
