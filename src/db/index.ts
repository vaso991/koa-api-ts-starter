import Knex from 'knex';
import { Model } from 'objection';
import path from 'path';

export class Db {
  private static knexInstance: ReturnType<typeof Knex>;
  public static async init(): Promise<ReturnType<typeof Knex>> {
    if (Db.knexInstance) {
      return Db.knexInstance;
    }
    const knex = Knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
      debug: false,
    });
    try {
      await knex.migrate.latest({
        directory: path.join(__dirname, 'migrations'),
        loadExtensions: ['.ts', '.js'],
      });
    } catch (error) {
      console.error(error);
    }
    Model.knex(knex);
    Db.knexInstance = knex;
    return knex;
  }
  public static async get() {
    return Db.init();
  }
}
