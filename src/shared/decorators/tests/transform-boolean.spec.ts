import { plainToClass } from 'class-transformer';
import { TransformBoolean } from '../transform-boolean';

class TestData {
  @TransformBoolean()
  data: boolean;
}

describe('TransformBoolean', () => {
  it.each([
    ['true', true],
    ['True', true],
    ['TRUE', true],
    ['false', false],
    ['False', false],
    ['FALSE', false],
    ['1', true],
    [1, true],
    [0, false],
    [null, false],
    [undefined, false],
  ])('should transform to boolean', (value, expected) => {
    const test = {
      data: value,
    };
    const result = plainToClass(TestData, test);
    expect(result.data).toEqual(expected);
  });
});
