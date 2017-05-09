import knex from '../utils/db';

const teacherSummaryFields = ['id', 'name', 'email'];
const teacherDetailedFields = [
  'id',
  'name',
  'email',
  'description',
  'image',
  'imageUrl',
  'title',
  'address',
  'phone',
  'area',
  'subjects',
  'company',
  'edStage',
];

export const dbGetTeachers = () => (
  knex('users')
    .where({ isTeacher: 'true' })
    .select(teacherSummaryFields)
);

export const dbGetTeacher = id => (
  knex('users')
    .first(teacherDetailedFields)
    .where({ isTeacher: 'true', id })
);
