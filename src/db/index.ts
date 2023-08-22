import knex, { Knex } from 'knex';
import { Model } from 'objection';
import path from 'path';
import { AppEnv } from '@App/app.env';

export class Db {
  private static knexInstance: Knex;

  public static async init(): Promise<Knex> {
    if (Db.knexInstance) {
      return Db.knexInstance;
    }

    const _knex = knex({
      client: 'pg',
      connection: AppEnv.DATABASE_URL,
      debug: AppEnv.DATABASE_DEBUG,
    });
    await _knex.migrate.latest({
      directory: path.join(__dirname, 'migrations'),
      loadExtensions: ['.ts', '.js'],
    });
    Model.knex(_knex);
    Db.knexInstance = _knex;
    return _knex;
  }

  public static destroy() {
    console.log('Closing db connection...');
    if (Db.knexInstance) {
      return Db.knexInstance.destroy();
    }
  }

  public static async get() {
    return Db.init();
  }

  public static async seed() {
    return Db.knexInstance.seed.run({
      directory: path.join(__dirname, 'seeds'),
      loadExtensions: ['.ts', '.js'],
    });
  }
}
