import Knex from 'knex';
import { Model } from 'objection';
import path from 'path';
import { AppEnv } from '../App.Env';

export class Db {
  private static knexInstance: ReturnType<typeof Knex>;
  public static async init(): Promise<ReturnType<typeof Knex>> {
    if (Db.knexInstance) {
      return Db.knexInstance;
    }
    const knex = Knex({
      client: 'pg',
      connection: AppEnv.DATABASE_URL,
      debug: false,
    });
    await knex.migrate.latest({
      directory: path.join(__dirname, 'migrations'),
      loadExtensions: ['.ts', '.js'],
    });
    Model.knex(knex);
    Db.knexInstance = knex;
    return knex;
  }
  public static async get() {
    return Db.init();
  }
}
