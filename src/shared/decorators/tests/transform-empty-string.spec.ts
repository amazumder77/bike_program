import { plainToClass } from 'class-transformer';
import { TransformEmptyString } from '../transform-empty-string';

class TestData {
  @TransformEmptyString()
  data?: string;
}

describe('TransformEmptyString', () => {
  it.each([
    ['test', 'test'],
    [123, 123],
    ['', null],
    [null, null],
  ])('should transform empty string', (value, expected) => {
    const test = {
      data: value,
    };
    const result = plainToClass(TestData, test);
    expect(result.data).toEqual(expected);
  });
});
