import knex from '../utils/db';

const teacherSummaryFields = ['id', 'name', 'email'];
const teacherDetailedFields = [
  'id',
  'name',
  'email',
  'description',
  'image',
  'title',
  'address',
  'phone',
  'area',
];

export const dbGetTeachers = () => (
  knex('users')
    .where({ scope: 'teacher' })
    .select(teacherSummaryFields)
);

export const dbGetTeacher = id => (
  knex('users')
    .first(teacherDetailedFields)
    .where({ scope: 'teacher', id })
);
