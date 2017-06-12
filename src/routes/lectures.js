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
  changeInvitationStatus,
} from '../controllers/lectures';

const validateLectureId = {
  validate: {
    params: {
      lectureId: Joi.number().integer().required(),
    },
  },
};


const lectures = [
  // Get a list of all lectures (admins)
  {
    method: 'GET',
    path: '/lectures',
    config: getAuthWithScope('admin'),
    handler: getLectures,
  },
  // Delete a lecture permanently from system (admins)
  {
    method: 'DELETE',
    path: '/lectures/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('admin')),
    handler: delLecture,
  },
  // Get more info about a specific lecture (teachers, admins)
  {
    method: 'GET',
    path: '/lectures/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('user')),
    handler: getLecture,
  },

  // Get a list of lectures (teachers)
  {
    method: 'GET',
    path: '/teacher/lectures',
    config: getAuthWithScope('user'),
    handler: getTeacherLectures,
  },
  // Create new lecture (teachers)
  {
    method: 'POST',
    path: '/teacher/lectures',
    config: getAuthWithScope('user'),
    handler: createLecture,
  },
  // Update a lecture (teachers)
  {
    method: 'PATCH',
    path: '/lectures/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('user')),
    handler: updateLecture,
  },

  // Get a list of lectures (experts)
  {
    method: 'GET',
    path: '/expert/lectures',
    config: merge(getAuthWithScope('user')),
    handler: getExpertLectures,
  },
  // Modify lecture invitation status (experts)
  {
    method: 'PATCH',
    path: '/invitations/{lectureId}',
    config: merge({}, validateLectureId, getAuthWithScope('user')),
    handler: changeInvitationStatus,
  },
];

export default lectures;
export const routes = server => server.route(lectures);
