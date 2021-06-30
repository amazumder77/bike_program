import { Knex } from 'knex';
import generateData from './generator';

export default class Seeder {
  constructor(
    private readonly knex: Knex,
  ) { }

  public async build(data?: Partial<object>): Promise<object> {
    const post = generateData(data);

    return {
      ...post,
    };
  }
}
