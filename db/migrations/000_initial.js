// FIXME: references

exports.up = knex => (
  knex.schema
    .createTableIfNotExists('users', (table) => {
      // common fields
      table.increments('id').primary();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.enum('scope', ['admin', 'user']).notNullable();
      table.text('name').notNullable();
      table.text('email').notNullable().unique();
      table.text('password');
      table.text('locale').notNullable();
      table.integer('oauth2_id');
      table.text('description');
      table.binary('image');
      table.text('image_url');

      table.bool('is_expert').defaultTo(false);
      table.bool('is_teacher').defaultTo(false);

      // common for teachers, experts
      table.text('title');
      table.text('address');
      table.text('phone');
      table.json('area'); // school for teacher

      // experts
      table.json('subjects');
    })

    .createTableIfNotExists('lectures', (table) => {
      table.increments('id').primary();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('title').notNullable().unique();
      table.text('description').notNullable();
      table.text('dates').notNullable();
      table.text('teacher_note').notNullable();
      table.text('expert_note').notNullable();
      table.text('target_students').notNullable();
      table.text('expert_id');
      table.text('teacher_id').notNullable();
      table.text('area').notNullable();
    })

    .createTableIfNotExists('feedback', (table) => {
      table.increments('id').primary();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.text('text').notNullable();
      table.enum('creator_type', ['expert', 'teacher']).notNullable();
      table.text('email').notNullable();
    })
);

exports.down = knex => (
  knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('lectures')
    .dropTableIfExists('feedback')
);
