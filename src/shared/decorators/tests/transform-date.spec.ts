import { TransformDate } from '../transform-date';
import { plainToClass } from 'class-transformer';

class DateTest {
  @TransformDate()
  date: Date;
}

describe('TransformDate', () => {
  it('should accept a date string', async () => {
    const test = {
      date: '2019-08-13T03:00:00.000Z',
    };
    const result = plainToClass(DateTest, test);
    expect(result.date.getTime()).toBe(new Date('2019-08-13T03:00:00.000Z').getTime());
  });

  it('should convert dates to utc', async () => {
    const test = {
      date: '2007-04-05T12:30-02:00',
    };
    const result = plainToClass(DateTest, test);
    expect(result.date.getTime()).toBe(new Date('2007-04-05T14:30Z').getTime());
  });

  it('should return null for empty string', async () => {
    const test = {
      date: '',
    };
    const result = plainToClass(DateTest, test);
    expect(result.date).toBeFalsy();
  });

  it('should return null for invalid Date', async () => {
    const test = {
      date: new Date('foo bar baz'),
    };
    const result = plainToClass(DateTest, test);
    expect(result.date).toBeFalsy();
  });
});
