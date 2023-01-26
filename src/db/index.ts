import Knex from 'knex';
import { Model } from 'objection';
import path from 'path';

export class Db {
  public static async init() {
    const knex = Knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
        debug: false,
    });
    await knex.migrate.latest({
        directory: path.join(__dirname, 'migrations'),
        loadExtensions: ['.ts', '.js']
    });
    Model.knex(knex);
    return knex;
  }
}
