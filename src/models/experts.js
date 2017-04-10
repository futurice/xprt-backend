import knex from '../utils/db';

const expertSummaryFields = [
  'id',
  'name',
  'email',
  'description',
  'image_url',
  'area',
  'subjects',
];

const expertDetailedFields = [
  'id',
  'name',
  'email',
  'description',
  'image_url',
  'title',
  'address',
  'phone',
  'area',
  'subjects',
];

export const dbGetExperts = (filter) => {
  /*
  let q = knex('users')
    .where({ scope: 'expert' })
    .select(expertSummaryFields);
*/
  let q = knex('users')
    .where({ is_expert: 'true' })
    .select(['id', 'name', 'email', 'description', 'is_expert']);
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
    .where({ is_expert: 'true', id })
);
