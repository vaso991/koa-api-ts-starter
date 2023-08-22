import bcrypt from 'bcrypt';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('Users').where('email', 'test@example.com').del();
  await knex('Users').where('email', 'auth@example.com').del();

  // Inserts seed entries
  await knex('Users').insert([
    {
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
    },
  ]);
}
