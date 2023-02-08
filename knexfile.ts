import type { Knex } from 'knex';

// Update with your config settings.

const config: Knex.Config = {
  client: 'pg',
  migrations: {
    extension: 'ts',
    directory: './src/db/migrations',
  },
};

module.exports = config;
