import Joi from 'joi';

import {
  getTeachers,
  getTeacher,
} from '../controllers/teachers';

const validateTeacherId = {
  validate: {
    params: {
      teacherId: Joi.number().integer().required(),
    },
  },
};

const teachers = [
  // Get a list of all teachers
  {
    method: 'GET',
    path: '/teachers',
    handler: getTeachers,
  },

  // Get more info about a specific teacher
  {
    method: 'GET',
    path: '/teachers/{teacherId}',
    config: validateTeacherId,
    handler: getTeacher,
  },
];

export default teachers;
export const routes = server => server.route(teachers);
