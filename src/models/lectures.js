import knex from '../utils/db';

const lectureSummaryFields = [
  'lectures.id',
  'lectures.createdAt',
  'lectures.title',
  'lectures.description',
  'lectures.dateOption1',
  'lectures.dateOption2',
  'lectures.statusDate',
  'lectures.edStage',
  'lectures.status',
  'lectures.subjects',
  'users.name as expertName',
  'users.email as email',
  'users.phone as phone',

];
const myLectureSummaryFields = [
  'lectures.id',
  'lectures.createdAt as datesent',
  'lectures.title as lecturetheme',
  'lectures.description',
  'lectures.dateOption1',
  'lectures.dateOption2',
  'lectures.statusDate',
  'lectures.edStage as educationalstage',
  'lectures.status',
  'lectures.subjects',
  'users.name as name',
  'users.email as email',
  'users.phone as phone',
  'users.company as school',
  'users.address as location',
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

export const dbGetMyLectures = userId => (
  knex('lectures')
    .select(myLectureSummaryFields)
    .where({ expertId: userId })
    .leftJoin('users', 'lectures.teacherId', 'users.id')
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
