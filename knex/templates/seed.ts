import { Knex } from 'knex';

import Seeder from './seeder';

exports.seed = async (knex: Knex): Promise<void> => {
  const someEntity = await new Seeder(knex).build();
};
