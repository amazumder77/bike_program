import ConfigService from './src/config/config.service';

const configService = new ConfigService();

const knexConfig = {
  client: 'mysql2',
  connection: {
    database: configService.DB_NAME,
    host: configService.DB_HOST,
    password: configService.DB_PASSWORD,
    port: configService.DB_PORT,
    user: configService.DB_USER,
  },
  migrations: {
    directory: 'knex/migrations',
    tableName: 'knex_migrations',
    extension: 'ts',
    stub: 'knex/templates/migration.ts',
  },
  seeds: {
    directory: 'knex/seeds',
    extension: 'ts',
    stub: 'knex/templates/seed.ts',
  },
  useNullAsDefault: true,
};

module.exports = knexConfig;
export default knexConfig;
