import Boom from 'boom';
import rp from 'request-promise';

import config from '../utils/config';

import { resizeImage } from '../utils/image';
import { createToken, hashPassword } from '../utils/auth';
import {
  dbGetUsers,
  dbGetUser,
  dbGetOAuth2User,
  dbDelUser,
  dbUpdateUser,
  dbCreateUser,
} from '../models/users';

export const getUsers = (request, reply) => dbGetUsers().then(reply);
export const getUser = (request, reply) => {
  if (request.pre.user.scope !== 'admin' && request.pre.user.id !== request.params.userId) {
    return reply(Boom.unauthorized('Unprivileged users can only view own userId!'));
  }

  return dbGetUser(request.params.userId).then(reply);
};

export const delUser = (request, reply) => {
  if (request.pre.user.scope !== 'admin' && request.pre.user.id !== request.params.userId) {
    return reply(Boom.unauthorized('Unprivileged users can only delete own userId!'));
  }

  return dbDelUser(request.params.userId).then(reply);
};

export const updateUser = async (request, reply) => {
  if (request.pre.user.scope !== 'admin' && request.pre.user.id !== request.params.userId) {
    return reply(Boom.unauthorized('Unprivileged users can only perform updates on own userId!'));
  }

  const fields = {
    email: request.payload.email,
    description: request.payload.description,
    image: request.payload.image,
  };

  // Only admins are allowed to modify user scope
  if (request.pre.user.scope === 'admin') {
    fields.scope = request.payload.scope;
  }

  // If request contains an image, resize it to max 512x512 pixels
  if (fields.image) {
    const buf = Buffer.from(fields.image, 'base64');
    await resizeImage(buf).then(resized => (fields.image = resized));
  }

  return dbUpdateUser(request.params.userId, fields).then(reply);
};

export const authUser = (request, reply) => (
  reply(createToken(request.pre.user.id, request.pre.user.email, 'expert'))
);

export const registerUser = (request, reply) => (
  hashPassword(request.payload.password)
    .then(password => dbCreateUser({ ...request.payload, password, scope: 'expert' })
    .then(reply))
    .catch((err) => {
      if (err.constraint === 'users_email_unique') {
        reply(Boom.conflict('Account already exists'));
      } else {
        reply(Boom.badImplementation(err));
      }
    })
);

export const oauth2Authenticate = async (request, reply) => {
  if (!request.auth.isAuthenticated) {
    return reply(`Authentication failed due to: ${request.auth.error.message}`);
  }

  try {
    const token = request.auth.credentials.token;

    let oa2User = await rp({
      uri: config.oauth2.userEndpoint,
      qs: { access_token: token },
    });

    // NOTE: server returns Content-Type: text/html, not application/json. Must parse manually.
    oa2User = JSON.parse(oa2User).user;

    let registeredUser = await dbGetOAuth2User(oa2User.id);

    if (!registeredUser) {
      registeredUser = await dbCreateUser({
        scope: 'expert',
        name: `${oa2User.first_name} ${oa2User.last_name}`,
        email: oa2User.email,
        locale: oa2User.lang_name,
        oauth2Id: oa2User.id,
        imageUrl: oa2User.avatar_thumb,
      });
    }

    return reply(createToken(registeredUser.id, registeredUser.email, registeredUser.scope));
  } catch (err) {
    if (err.constraint === 'users_email_unique') {
      return reply(Boom.conflict('Account already exists'));
    }

    return reply(Boom.badImplementation(err));
  }
};
