import { TransformStringToArray } from '../transform-string-to-array';
import { plainToClass } from 'class-transformer';

class TestData {
  @TransformStringToArray()
  data: Array<string>;
}

class TestDataWithDelimiter {
  @TransformStringToArray({ delimiter: ';', trim: true })
  data: Array<string>;
}

describe('TransformStringToArray', () => {
  it('should return array with default delimiter', async () => {
    const test = {
      data: 'test1,test2',
    };
    const result = plainToClass(TestData, test);
    expect(result.data).toEqual(['test1', 'test2']);
  });

  it('should return all value', async () => {
    const test = {
      data: 'all',
    };
    const result = plainToClass(TestData, test);
    expect(result.data).toEqual('all');
  });

  it('should return array by specific delimiter and trim values', async () => {
    const test = {
      data: 'test1 ; test2 ',
    };
    const result = plainToClass(TestDataWithDelimiter, test);
    expect(result.data).toEqual(['test1', 'test2']);
  });
});
