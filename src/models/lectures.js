import knex from '../utils/db';

const lectureSummaryFields = ['id', 'createdAt', 'title', 'dates'];
const lectureDetailedFields = '*';

export const dbGetLectures = userId => (
  knex('lectures')
    .select(lectureSummaryFields)
    .where({ teacherId: userId })
);

export const dbGetLecture = id => (
  knex('lectures')
    .first(lectureDetailedFields)
    .where({ id })
);

export const dbUpdateLecture = (userId, lectureId, fields) => (
  console.log({fields}),
  knex('lectures')
    .update({ ...fields })
    .where({ id: lectureId })
    .where({ teacherId: userId })
);

export const dbDelLecture = id => (
  knex('lectures')
    .where({ id })
    .del()
);

export const dbCreateLecture = (userId, fields) => (
  knex('lectures')
    .insert({ ...fields, teacherId: userId })
    .returning(lectureDetailedFields)
    .then(results => results[0])
    // return only first result
);
