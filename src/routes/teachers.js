import Joi from 'joi';
import { merge } from 'lodash';

import { getAuthWithScope } from '../utils/auth';

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
    config: getAuthWithScope('admin'),
    handler: getTeachers,
  },

  // Get more info about a specific teacher
  {
    method: 'GET',
    path: '/teachers/{teacherId}',
    config: merge({}, validateTeacherId, getAuthWithScope('admin')),
    handler: getTeacher,
  },
];

export default teachers;
export const routes = server => server.route(teachers);
