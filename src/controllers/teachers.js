import {
  dbGetTeachers,
  dbGetTeacher,
} from '../models/teachers';

export const getTeachers = (request, reply) => dbGetTeachers().then(reply);
export const getTeacher = (request, reply) => dbGetTeacher(request.params.teacherId).then(reply);
