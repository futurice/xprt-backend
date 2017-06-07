import knex, { likeFilter } from '../utils/db';

import config from '../utils/config';

const userSummaryFields = ['id', 'name', 'phone', 'company', 'title', 'email', 'description', 'details',
'address', 'subjects', 'area', 'locale', 'scope', 'imageUrl','isExpert','isTeacher','edStage',
'officeVisit'];
const userDetailedFields = ['id', 'name', 'phone', 'company', 'title', 'email', 'description', 'details',
'address', 'subjects', 'area', 'locale', 'scope', 'image', 'imageUrl','edStage', 'isExpert', 'isTeacher',
'officeVisit'];

export const dbGetUsers = filters => (
  knex('users')
    .select(userSummaryFields)
    .where(likeFilter(filters))
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

export const dbUpdateMyUser = (id, fields) => (
  knex('users')
    .update({ ...fields })
    .where({ id })
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

export const dbCreateUser = ({ password, ...fields }) => (
  knex.transaction(async (trx) => {
    const user = await trx('users')
      .insert(fields)
      .returning('*')
      .then(results => results[0]); // return only first result

    await trx('secrets')
      .insert({
        ownerId: user.id,
        password,
      });

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
