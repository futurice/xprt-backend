import knex from '../utils/db';

const teacherLectureSummaryFields = [
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
  'users.imageUrl as expertImageUrl',
  'users.email as email',
  'users.phone as phone',

];
const expertLectureSummaryFields = [
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
  'users.imageUrl as expertImageUrl',
  'users.email as email',
  'users.phone as phone',
  'users.company as school',
  'users.address as location',
];

const adminLectureSummaryFields = [
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
  'experts.name as ExpertName',
  'experts.phone as ExpertPhone',
  'experts.email as ExpertEmail',
  'teachers.name as TeacherName',
  'teachers.phone as TeacherPhone',
  'teachers.email as TeacherEmail',
  'teachers.address as TeacherAddress',
  'teachers.company as TeacherSchool',
];

const lectureDetailedFields = [
  'lectures.*',
  'users.name as expertName',
  'users.imageUrl as expertImageUrl',
  'users.title as expertTitle',
  'users.area as expertArea',
];

export const dbGetTeacherLectures = userId => (
  knex('lectures')
    .select(teacherLectureSummaryFields)
    .where({ teacherId: userId })
    .leftJoin('users', 'lectures.expertId', 'users.id')
);

export const dbGetExpertLectures = userId => (
  knex('lectures')
    .select(expertLectureSummaryFields)
    .where({ expertId: userId })
    .leftJoin('users', 'lectures.teacherId', 'users.id')
);

export const dbGetLectures = () => (
  knex('lectures')
    .select(adminLectureSummaryFields)
    .leftJoin('users as teachers', 'lectures.teacherId', 'teachers.id')
    .leftJoin('users as experts', 'lectures.expertId', 'experts.id')
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

export const dbUpdateLectureExpert = (userId, lectureId, fields) => (
  knex('lectures')
    .update({ ...fields })
    .where({ id: lectureId })
    .where({ expertId: userId })
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
