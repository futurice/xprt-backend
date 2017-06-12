import {
  dbGetTeachers,
  dbGetTeacher,
} from '../models/teachers';

// ADMIN ONLY (NOTE: unused)
export const getTeachers = (request, reply) => dbGetTeachers().then(reply);
// ADMIN ONLY (NOTE: unused)
export const getTeacher = (request, reply) => dbGetTeacher(request.params.teacherId).then(reply);
