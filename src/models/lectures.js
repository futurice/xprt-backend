import knex from '../utils/db';

const lectureSummaryFields = ['id', 'createdAt', 'title', 'dates'];
const lectureDetailedFields = '*';

export const dbGetLectures = () => (
  knex('lectures')
    .select(lectureSummaryFields)
);

export const dbGetLecture = id => (
  knex('lectures')
    .first(lectureDetailedFields)
    .where({ id })
);

export const dbUpdateLecture = (id, fields) => (
  knex('lectures')
    .update({ ...fields })
    .where({ id })
);

export const dbDelLecture = id => (
  knex('lectures')
    .where({ id })
    .del()
);

export const dbCreateLecture = fields => (
  knex('lectures')
    .insert(fields)
    .then(results => results[0]) // return only first result
);
