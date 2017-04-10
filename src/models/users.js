import knex from '../utils/db';

const userSummaryFields = ['id', 'email'];
const userDetailedFields = ['id', 'email', 'description', 'locale', 'scope', 'image', 'image_url'];

export const dbGetUsers = () => (
  knex('users')
    .select(userSummaryFields)
);

export const dbGetUser = id => (
  knex('users')
    .first(userDetailedFields)
    .where({ id })
);

export const dbGetOAuth2User = oauth2Id => (
  knex('users')
    .first(userDetailedFields)
    .where({ oauth2Id })
);

export const dbUpdateUser = (id, fields) => (
  knex('users')
    .update({ ...fields })
    .where({ id })
);

export const dbDelUser = id => (
  knex('users')
    .where({ id })
    .del()
);

export const dbCreateUser = fields => (
  knex('users')
    .insert(fields)
    .returning(userDetailedFields)
    .then(results => results[0]) // return only first result
);
