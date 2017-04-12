import knex from '../utils/db';

const expertSummaryFields = [
  'id',
  'name',
  'email',
  'description',
  'imageUrl',
  'area',
  'subjects',
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
];

export const dbGetExperts = (filter) => {
  let q = knex('users')
    .where({ isExpert: 'true' })
    .select(expertSummaryFields);

  if (filter) {
    q = q.whereRaw("LOWER(name) LIKE '%' || LOWER(?) || '%'", filter)
    .orWhereRaw("LOWER(title) LIKE '%' || LOWER(?) || '%'", filter)
    .orWhereRaw("LOWER(description) LIKE '%' || LOWER(?) || '%'", filter)
    .orWhereRaw("LOWER(area::text) LIKE '%' || LOWER(?) || '%'", filter)
    .orWhereRaw("LOWER(subjects::text) LIKE '%' || LOWER(?) || '%'", filter);
  }

  return q;
};

export const dbGetExpert = id => (
  knex('users')
    .first(expertDetailedFields)
    .where({ isExpert: 'true', id })
);
