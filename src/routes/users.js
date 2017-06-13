import { merge } from 'lodash';
import Joi from 'joi';

import { getAuthWithScope, doAuth } from '../utils/auth';
import {
  getMyUser,
  getUsers,
  getUser,
  getProfilePicture,
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
      password: Joi.string().required().min(6),
      oauth2Id: Joi.any().forbidden(), // Disallow setting oauth2Id
      description: Joi.string().optional(),
      details: Joi.string().optional(),
      isExpert: Joi.boolean().optional(),
      isTeacher: Joi.boolean().optional(),
      title: Joi.string().optional(),
      address: Joi.string().optional(),
      phone: Joi.string().optional(),
      company: Joi.string().optional(),
      officeVisit: Joi.boolean().optional(),
      subjects: Joi.array().optional(Joi.string()),
      area: Joi.array().optional(Joi.string()),
    },
  },
};

const users = [
  // ADMIN: Get a list of all users (experts & teachers)
  {
    method: 'GET',
    path: '/users',
    config: getAuthWithScope('admin'),
    handler: getUsers,
  },
  // ADMIN: Get info about a specific user (experts & teachers)
  {
    method: 'GET',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: getUser,
  },
  // ADMIN: Modify any user fields (experts & teachers)
  {
    method: 'PATCH',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: updateUser,
  },
  // ADMIN: Delete a user (experts & teachers)
  {
    method: 'DELETE',
    path: '/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: delUser,
  },

  // Get own profile
  {
    method: 'GET',
    path: '/users/me',
    config: getAuthWithScope('user'),
    handler: getMyUser,
  },
  // Update own profile
  {
    method: 'PATCH',
    path: '/users/me',
    config: getAuthWithScope('user'),
    handler: updateMyUser,
  },

  // Fetch profile picture (NOTE: public, fix this? NOTE2: must be public for expert user profiles)
  {
    method: 'GET',
    path: '/users/profile/{userId}.png',
    // config: getAuthWithScope('user'), // TODO: require authentication?
    handler: getProfilePicture,
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
