import knex, { likeFilter } from '../utils/db';

import config from '../utils/config';

const userFields = [
  'id',
  'name',
  'phone',
  'company',
  'title',
  'email',
  'description',
  'details',
  'address',
  'subjects',
  'area',
  'locale',
  'scope',
  'imageUrl',
  'isExpert',
  'isTeacher',
  'edStage',
  'officeVisit',
];

export const dbGetUsers = ({ isExpert, isTeacher, any }) => {
  let q = knex('users')
    .select(userFields)
    .where(likeFilter({
      'users.name': any,
      'users.email': any,
    }, true));

  if (isExpert) {
    q = q.andWhere({ isExpert: true });
  }
  if (isTeacher) {
    q = q.andWhere({ isTeacher: true });
  }

  return q;
};

export const dbGetUser = id => (
  knex('users')
    .first(userFields)
    .where({ id })
);

export const dbGetUserImage = id => (
  knex('users')
    .first('image')
    .where({ id })
);

export const dbGetOAuth2User = oauth2Id => (
  knex('users')
    .first(userFields)
    .where({ oauth2Id })
);

export const dbUpdateUser = (id, fields) => (
  knex('users')
    .update({ ...fields })
    .where({ id })
    .returning(userFields)
    .then(results => results[0]) // return only first result
);

export const dbDelUser = id => (
  knex('users')
    .where({ id })
    .del()
);

export const dbCreateUser = ({ password, ...fields }) => (
  knex.transaction(async (trx) => {
    const user = await trx('users')
      .insert(fields)
      .returning(userFields)
      .then(results => results[0]); // return only first result

    if (password) {
      await trx('secrets')
        .insert({
          ownerId: user.id,
          password,
        });
    }

    if (!fields.imageUrl) {
      await trx('users')
        .update({
          imageUrl: `${config.backendUrl}/users/profile/${user.id}.png`,
        })
        .where({ id: user.id });

      user.imageUrl = `${config.backendUrl}/users/profile/${user.id}.png`;
    }

    return user;
  })
);
