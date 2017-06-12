// FIXME: references

exports.up = knex => (
  knex.schema
    /**
     * Users table
     *
     * Contains info on all users in the system
     */
    .createTableIfNotExists('users', (table) => {
      // common fields
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.enum('scope', ['admin', 'user']).notNullable();
      table.text('name').notNullable();
      table.text('email').notNullable().unique();
      table.text('locale').notNullable();
      table.integer('oauth2Id');
      table.text('description');
      table.binary('image');
      table.text('imageUrl');
      table.text('edStage');

      table.bool('isExpert').defaultTo(false);
      table.bool('isTeacher').defaultTo(false);
      table.bool('officeVisit');

      // common for teachers, experts
      table.text('company'); // school for teacher
      table.text('title');
      table.text('address');
      table.text('phone');
      table.json('area');

      // experts
      table.json('subjects');
      table.text('details');
    })

    .createTableIfNotExists('lectures', (table) => {
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('title').notNullable();
      table.text('description').notNullable();
      table.enum('status', [
        'pending',
        'accepted',
        'declined',
      ]).defaultTo('pending');
      table.timestamp('statusDate').notNullable(); // new attribute
      table.timestamp('dateOption1').notNullable(); // dates changed to dateOption1
      table.timestamp('dateOption2'); // new attribute
      table.text('teacherNote');
      table.text('expertNote');
      table.text('edStage').notNullable(); // targetStudents changed to edStage
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
      table.text('location').notNullable();
      table.json('subjects');
    })

    .createTableIfNotExists('feedback', (table) => {
      table.increments('id').primary();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.text('text').notNullable();
      table.enum('creatorType', ['expert', 'teacher']).notNullable();
      table.text('email');
      table.text('phone');
      table.text('name');
      table.text('type'); // Anonymoys feedback OR support request
    })

    /**
     * Define a separate table for storing user secrets (such as password hashes).
     *
     * The rationale is:
     *   - Have to explicitly join/query password table to access secrets
     *   - Don't have to filter out secrets in every 'users' table query
     *
     * => Harder to accidentally leak out user secrets
     *
     * You may want to store other user secrets in this table as well.
     */
    .createTableIfNotExists('secrets', (table) => {
      table.integer('ownerId').references('id').inTable('users').primary();
      table.text('password').notNullable();
    })
);

exports.down = knex => (
  knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('secrets')
    .dropTableIfExists('lectures')
    .dropTableIfExists('feedback')
);
