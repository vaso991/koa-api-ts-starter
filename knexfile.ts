import type { Knex } from 'knex';

// Update with your config settings.

const config: Knex.Config = {
  client: 'pg',
  migrations: {
    extension: 'ts',
    directory: './src/db/migrations',
  },
  seeds: {
    directory: './src/db/seeds',
  },
};

module.exports = config;
