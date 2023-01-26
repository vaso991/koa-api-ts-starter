import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('Users', (table) => {
    table
      .uuid('id')
      .primary()
      .unique()
      .defaultTo(knex.raw('uuid_generate_v1()'));
    table.string('email').unique();
    table.string('firstName');
    table.string('lastName');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Users');
}
