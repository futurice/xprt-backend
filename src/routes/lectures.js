import Joi from 'joi';
import { merge } from 'lodash';

import { getAuthWithScope } from '../utils/auth';

import {
  getLectures,
  getLecture,
  createLecture,
  updateLecture,
  delLecture,
} from '../controllers/lectures';

const validateLectureId = {
  validate: {
    params: {
      lectureId: Joi.number().integer().required(),
    },
  },
};


const lectures = [
  // Get a list of all lectures
  {
    method: 'GET',
    path: '/lectures',
    handler: getLectures,
  },

  // Get more info about a specific lecture
  {
    method: 'GET',
    path: '/lectures/{lectureId}',
    config: validateLectureId,
    handler: getLecture,
  },

  // Create new lecture
  {
    method: 'POST',
    path: '/lectures',
    config: getAuthWithScope('teacher'),
    handler: createLecture,
  },

  // Update a lecture
  {
    method: 'POST',
    path: '/lectures/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('teacher')), // FIXME: expert access?
    handler: updateLecture,
  },

  // Delete a lecture
  {
    method: 'DELETE',
    path: '/lectures/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('teacher')), // FIXME: expert access?
    handler: delLecture,
  },
];

export default lectures;
export const routes = server => server.route(lectures);
