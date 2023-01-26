import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(): Promise<void> {}