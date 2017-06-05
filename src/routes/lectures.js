import Joi from 'joi';
import { merge } from 'lodash';

import { getAuthWithScope } from '../utils/auth';

import {
  getTeacherLectures,
  getExpertLectures,
  getLectures,
  getLecture,
  createLecture,
  updateLecture,
  delLecture,
  updateInvitation,
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
    path: '/teacher/lectures',
    config: getAuthWithScope('user'),
    handler: getTeacherLectures,
  },
  {
    method: 'GET',
    path: '/expert/lectures',
    config: merge({}, getAuthWithScope('user')),
    handler: getExpertLectures,
  },

  // Get more info about a specific lecture
  {
    method: 'GET',
    path: '/lectures/{lectureId}',
    config: validateLectureId,
    handler: getLecture,
  },
  // Invitations
  {
    method: 'PATCH',
    path: '/invitations/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('user')),
    handler: updateInvitation,
  },
  // Create new lecture
  {
    method: 'POST',
    path: '/teacher/lectures',
    config: getAuthWithScope('user'),
    handler: createLecture,
  },

  // Update a lecture
  {
    method: 'PATCH',
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
