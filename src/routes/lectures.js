import Joi from 'joi';
import { merge } from 'lodash';

import { getAuthWithScope } from '../utils/auth';

import {
  getLectures,
  getMyLectures,
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
    config: getAuthWithScope('user'),
    handler: getLectures,
  },
  {
    method: 'GET',
    path: '/lectures/me',
    config: merge({}, getAuthWithScope('user')),
    handler: getMyLectures,
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
    config: getAuthWithScope('user'),
    handler: createLecture,
  },

  // Update a lecture
  {
    method: 'POST',
    path: '/lectures/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('user')), // FIXME: expert access?
    handler: updateLecture,
  },

  // Delete a lecture
  {
    method: 'DELETE',
    path: '/lectures/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('user')), // FIXME: expert access?
    handler: delLecture,
  },
];

export default lectures;
export const routes = server => server.route(lectures);
