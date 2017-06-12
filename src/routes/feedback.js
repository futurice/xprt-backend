import Joi from 'joi';
import { merge } from 'lodash';

import { getAuthWithScope } from '../utils/auth';

import {
  getAllFeedback,
  getFeedback,
  createFeedback,
  delFeedback,
} from '../controllers/feedback';

const validateFeedbackId = {
  validate: {
    params: {
      feedbackId: Joi.number().integer().required(),
    },
  },
};

const validateFeedbackContent = {
  validate: {
    payload: {
      text: Joi.string().required(),
      creatorType: Joi.string(),
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    },
  },
};

const feedback = [
  // Get a list of all feedback
  {
    method: 'GET',
    path: '/feedback',
    config: getAuthWithScope('admin'),
    handler: getAllFeedback,
  },

  // Get more info about a specific feedback
  {
    method: 'GET',
    path: '/feedback/{feedbackId}',
    config: merge({}, validateFeedbackId, getAuthWithScope('admin')),
    handler: getFeedback,
  },

  // Create new feedback
  {
    method: 'POST',
    path: '/feedback',
    config: validateFeedbackContent,
    handler: createFeedback,
  },

  // Delete feedback
  {
    method: 'DELETE',
    path: '/feedback/{feedbackId}',
    config: merge({}, validateFeedbackId, getAuthWithScope('admin')),
    handler: delFeedback,
  },
];

export default feedback;
export const routes = server => server.route(feedback);
