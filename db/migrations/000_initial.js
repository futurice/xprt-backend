// FIXME: references

exports.up = knex => (
  knex.schema
    .createTableIfNotExists('users', (table) => {
      // common fields
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.enum('scope', ['admin', 'user']).notNullable();
      table.text('name').notNullable();
      table.text('email').notNullable().unique();
      table.text('password');
      table.text('locale').notNullable();
      table.integer('oauth2Id');
      table.text('description');
      table.binary('image');
      table.text('imageUrl');

      table.bool('isExpert').defaultTo(false);
      table.bool('isTeacher').defaultTo(false);

      // common for teachers, experts
      table.text('company');
      table.text('title');
      table.text('address');
      table.text('phone');
      table.json('area'); // school for teacher

      // experts
      table.json('subjects');
    })

    .createTableIfNotExists('lectures', (table) => {
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('title').notNullable();
      table.text('description').notNullable();
      table.text('dates').notNullable();
      table.text('teacherNote');
      table.text('expertNote');
      table.text('targetStudents').notNullable();
      table
        .integer('expertId')
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('SET NULL');
      table
        .integer('teacherId')
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE');
      table.boolean('contactByEmail').notNullable();
      table.boolean('contactByPhone').notNullable();
      table.text('area').notNullable();
    })

    .createTableIfNotExists('feedback', (table) => {
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('text').notNullable();
      table.enum('creatorType', ['expert', 'teacher']).notNullable();
      table.text('email').notNullable();
    })
);

exports.down = knex => (
  knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('lectures')
    .dropTableIfExists('feedback')
);
