import { plainToClass } from 'class-transformer';
import { TransformNumberString } from '../transform-number-string';

class TestData {
  @TransformNumberString()
  data?: number;
}

class TestDataWithOption {
  @TransformNumberString({ convertNulls: true })
  data?: number;
}

describe('TransformNumberString', () => {
  it.each([
    ['null', NaN],
    [123, 123],
    ['123', 123],
    ['test', NaN],
    ['', null],
    [null, null],
  ])('should transform to number', (value, expected) => {
    const test = {
      data: value,
    };
    const result = plainToClass(TestData, test);
    expect(result.data).toEqual(expected);
  });

  it.each([
    ['null', null],
    [123, 123],
    ['123', 123],
    ['test', NaN],
    ['', null],
    [null, null],
  ])('should transform to number and convert null string', (value, expected) => {
    const test = {
      data: value,
    };
    const result = plainToClass(TestDataWithOption, test);
    expect(result.data).toEqual(expected);
  });
});
