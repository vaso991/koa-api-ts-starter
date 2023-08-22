import knex from 'knex';
import path from 'path';
import dotenv from 'dotenv-flow';

dotenv.config();

export default async function () {
  const _knex = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });
  await _knex.seed.run({
    directory: path.join(__dirname, '..', 'src', 'db', 'seeds'),
    loadExtensions: ['.ts', '.js'],
  });
}
