import knex from '../utils/db';

const expertSummaryFields = ['id', 'name', 'email'];
const expertDetailedFields = [
  'id',
  'name',
  'email',
  'description',
  'image',
  'title',
  'address',
  'phone',
  'area',
  'subjects',
];

export const dbGetExperts = (filter) => {
  let q = knex('users')
    .where({ scope: 'expert' })
    .select(expertSummaryFields);

  if (filter) {
    q = q.whereRaw("LOWER(name) LIKE '%' || LOWER(?) || '%'", filter);
  }

  return q;
};

export const dbGetExpert = id => (
  knex('users')
    .first(expertDetailedFields)
    .where({ scope: 'expert', id })
);
