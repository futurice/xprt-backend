import knex, { likeFilter } from '../utils/db';

const expertSummaryFields = [
  'id',
  'name',
  'email',
  'description',
  'imageUrl',
  'area',
  'subjects',
  'title',
  'company',
];

const expertDetailedFields = [
  'id',
  'name',
  'email',
  'description',
  'imageUrl',
  'title',
  'address',
  'phone',
  'area',
  'subjects',
  'company',
];

export const dbGetExperts = filter => (
  knex('users')
    .select(expertSummaryFields)
    .where({ isExpert: 'true' })
    .limit(50)
    .andWhere(likeFilter({
      name: filter,
      title: filter,
      description: filter,
      //'area::text': filter,
      //'subjects': filter,
    }, true))
);

export const dbGetExpert = id => (
  knex('users')
    .first(expertDetailedFields)
    .where({ isExpert: 'true', id })
);
