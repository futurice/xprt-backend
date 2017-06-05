import { merge } from 'lodash';
import Joi from 'joi';

import { getAuthWithScope, doAuth } from '../utils/auth';
import {
  getMyUser,
  getUsers,
  getUser,
  updateUser,
  updateMyUser,
  delUser,
  authUser,
  registerUser,
  oauth2Authenticate,
} from '../controllers/users';

const validateUserId = {
  validate: {
    params: {
      userId: Joi.number().integer().required(),
    },
  },
};

const validateRegistrationFields = {
  validate: {
    payload: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      locale: Joi.string().required(),
      password: Joi.string().required(),
      oauth2Id: Joi.any().forbidden(), // Disallow setting oauth2Id
      description: Joi.string().optional(),
      details: Joi.string().optional(),
      isExpert: Joi.boolean().optional(),
      isTeacher: Joi.boolean().optional(),
      title: Joi.string().optional(),
      address: Joi.string().optional(),
      phone: Joi.string().optional(),
      company: Joi.string().optional(),
      subjects: Joi.array().optional(Joi.string()),
      area: Joi.array().optional(Joi.string()),
    },
  },
};

const users = [
  // Get a list of all users
  {
    method: 'GET',
    path: '/users',
    config: getAuthWithScope('admin'),
    handler: getUsers,
  },
  {
    method: 'GET',
    path: '/users/me',
    config: merge({}, getAuthWithScope('user')),
    handler: getMyUser,
  },

  // Get info about a specific user
  {
    method: 'GET',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('user')),
    handler: getUser,
  },

  // Update user profile
  {
    method: 'POST',
    path: '/users/me',
    config: merge({}, getAuthWithScope('user')),
    handler: updateMyUser,
  },

  {
    method: 'POST',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: updateUser,
  },

  // Delete a user, admin only
  {
    method: 'DELETE',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: delUser,
  },

  // Authenticate as user
  {
    method: 'POST',
    path: '/users/authenticate',
    config: doAuth,
    handler: authUser,
  },

  // Register new user
  {
    method: 'POST',
    path: '/users',
    config: validateRegistrationFields,
    handler: registerUser,
  },

  // Register/authenticate via OAuth2
  {
    method: ['GET', 'POST'],
    path: '/oauth2/callback',
    config: {
      auth: 'hundred',
    },
    handler: oauth2Authenticate,
  },
];

export default users;

// Here we register the routes
export const routes = server => server.route(users);
