import knex from '../utils/db';

const lectureSummaryFields = [
  'lectures.id',
  'lectures.createdAt',
  'lectures.title',
  'lectures.dates',
  'lectures.status',
  'users.name as expertName',
];
const lectureDetailedFields = [
  'lectures.*',
  'users.name as expertName',
  'users.imageUrl as expertImageUrl',
  'users.title as expertTitle',
  'users.area as expertArea',
];

export const dbGetLectures = userId => (
  knex('lectures')
    .select(lectureSummaryFields)
    .where({ teacherId: userId })
    .leftJoin('users', 'lectures.expertId', 'users.id')
);

export const dbGetLecture = id => (
  knex('lectures')
    .first(lectureDetailedFields)
    .where({ 'lectures.id': id })
    .leftJoin('users', 'lectures.expertId', 'users.id')
);

export const dbUpdateLecture = (userId, lectureId, fields) => (
  knex('lectures')
    .update({ ...fields })
    .where({ id: lectureId })
    .where({ teacherId: userId })
);

export const dbDelLecture = (userId, lectureId) => (
  knex('lectures')
    .where({ id: lectureId })
    .where({ teacherId: userId })
    .del()
);

export const dbCreateLecture = (userId, fields) => (
  knex('lectures')
    .insert({ ...fields, teacherId: userId })
    .returning('*')
    .then(results => results[0])
    // return only first result
);
