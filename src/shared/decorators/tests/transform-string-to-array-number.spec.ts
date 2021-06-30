import { TransformStringToArrayNumber } from '../transform-string-to-array-number';
import { plainToClass } from 'class-transformer';

class TestData {
  @TransformStringToArrayNumber()
  data: number | Array<number>;
}

describe('TransformStringToArrayNumber', () => {
  it.each([
    ['1', 1],
    [
      ['1', '2', '3'],
      [1, 2, 3],
    ],
    ['test', NaN],
    ['', NaN],
    [null, null],
    [undefined, undefined],
  ])('should transform to number or array number', (value, expected) => {
    const test = {
      data: value,
    };
    const result = plainToClass(TestData, test);
    expect(result.data).toEqual(expected);
  });
});
