import Boom from 'boom';
import rp from 'request-promise';
import dataUriToBuffer from 'data-uri-to-buffer';

import fs from 'fs';
import { join } from 'path';
import config from '../utils/config';
import sendMail from '../utils/email';

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

const unknown = fs.readFileSync(join(__dirname, '..', 'assets', 'unknown.png'));

// ADMIN ONLY: Get all users / detailed info about one user
export const getUsers = (request, reply) => dbGetUsers(request.query.filter || {}).then(reply);
export const getUser = (request, reply) => dbGetUser(request.params.userId).then(reply);

// PUBLIC: Fetch profile picture
export const getProfilePicture = (request, reply) => dbGetUser(request.params.userId)
  .then((user) => {
    if (!user) {
      reply(Boom.notFound());
    } else if (user.image) {
      reply(user.image);
    } else {
      reply(unknown);
    }
  });

// TEACHERS, EXPERTS, ADMINS: Delete user account (unused by clients)
export const delUser = (request, reply) => {
  if (request.pre.user.scope !== 'admin' && request.pre.user.id !== request.params.userId) {
    return reply(Boom.unauthorized('Unprivileged users can only delete own userId!'));
  }

  return dbDelUser(request.params.userId).then(reply);
};

// TEACHERS & EXPERTS: Get info about own user
export const getMyUser = (request, reply) => dbGetUser(request.pre.user.id).then(reply);

// TEACHERS & EXPERTS: Update own profile
// NOTE: For teachers, some fields are fetched from OAuth2 endpoint
// TODO: prohibit updating these fields via this endpoint?
// (worst case scenario is they get out of sync with OAuth2 endpoint, until next login)
export const updateMyUser = async (request, reply) => {
  const fields = {
    name: request.payload.name,
    email: request.payload.email,
    locale: request.payload.locale,
    description: request.payload.description,
    details: request.payload.details,
    title: request.payload.title,
    address: request.payload.address,
    phone: request.payload.phone,
    company: request.payload.company,
    officeVisit: request.payload.officeVisit,
    subjects: JSON.stringify(request.payload.subjects),
    area: JSON.stringify(request.payload.area),
    image: request.payload.image,
    edStage: request.payload.edStage,
  };

  // If request contains an image, resize it to max 512x512 pixels
  if (fields.image) {
    const buf = dataUriToBuffer(fields.image);
    await resizeImage(buf).then(resized => (fields.image = resized));

    // Set imageUrl to point to backend
    fields.imageUrl = `${config.backendUrl}/users/profile/${request.pre.user.id}.png`;
  }

  return dbUpdateUser(request.pre.user.id, fields).then(reply);
};

// ADMIN ONLY: Update any user fields (including scope for upgrading users to admin status)
export const updateUser = async (request, reply) => {
  const fields = {
    ...request.payload.name,
    subjects: JSON.stringify(request.payload.subjects),
    area: JSON.stringify(request.payload.area),
  };

  // If request contains an image, resize it to max 512x512 pixels
  if (fields.image) {
    const buf = dataUriToBuffer(fields.image);
    await resizeImage(buf).then(resized => (fields.image = resized));

    // Set imageUrl to point to backend
    fields.imageUrl = `${config.backendUrl}/users/profile/${request.pre.user.id}.png`;
  }

  return dbUpdateUser(request.params.userId, fields).then(reply);
};

// Authenticate local user (experts)
export const authUser = (request, reply) => (
  reply(createToken({
    id: request.pre.user.id,
    name: request.pre.user.name,
    email: request.pre.user.email,
    scope: request.pre.user.scope,
    isTeacher: request.pre.user.isTeacher,
    isExpert: request.pre.user.isExpert,
  }))
);

// Register new local user (experts)
export const registerUser = (request, reply) => {
  if (request.payload.subjects) {
    request.payload.subjects = JSON.stringify(request.payload.subjects);
  }

  if (request.payload.area) {
    request.payload.area = JSON.stringify(request.payload.area);
  }

  return hashPassword(request.payload.password)
    .then(passwordHash => dbCreateUser({
      ...request.payload,
      password: passwordHash,
      scope: 'user',
    }))
    .then(user => reply(createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      scope: 'user',
      isTeacher: false,
      isExpert: true, // Only experts can register as local users
    })))
    .then(reply)
    .then(sendMail({
      to: request.payload.email,
      subject: 'Welcome to XPRT',
      text: 'Account created',
    }))
    .catch((err) => {
      if (err.constraint === 'users_email_unique') {
        reply(Boom.conflict('Account already exists'));
      } else {
        reply(Boom.badImplementation(err));
      }
    });
};

// Perform OAuth2 authentication (teachers)
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
      // Register as new user
      registeredUser = await dbCreateUser({
        scope: 'user',
        name: `${oa2User.first_name} ${oa2User.last_name}`,
        email: oa2User.email,
        locale: oa2User.lang_name,
        oauth2Id: oa2User.id,
        imageUrl: oa2User.avatar_thumb,
        isTeacher: true, // Only teachers can register through OAuth2
        isExpert: false,
      });
    } else {
      // User has logged in via OAuth2 previously, update local user according to OAuth2 user data
      registeredUser = await dbUpdateUser(registeredUser.id, {
        scope: 'user',
        name: `${oa2User.first_name} ${oa2User.last_name}`,
        email: oa2User.email,
        locale: oa2User.lang_name,
        oauth2Id: oa2User.id,
        imageUrl: oa2User.avatar_thumb,
        isTeacher: true, // Only teachers can register through OAuth2
        isExpert: false,
      });
    }

    // Return token inside JS window.postMessage(), which sends the token outside a RN <WebView>
    /* NOTE on this setInterval hack: https://github.com/facebook/react-native/issues/11594 */
    return reply(`
      <script type="text/javascript">
        setInterval(function() {
          window.postMessage(JSON.stringify(${JSON.stringify(
            createToken({
              id: registeredUser.id,
              name: registeredUser.name,
              email: registeredUser.email,
              scope: 'user',
              isTeacher: registeredUser.isTeacher,
              isExpert: registeredUser.isExpert,
            }),
          )}))},
        1000);
      </script>`,
    );
  } catch (err) {
    if (err.constraint === 'users_email_unique') {
      // TODO: what to do in this situation?
      return reply(Boom.conflict('Account already exists'));
    }

    return reply(Boom.badImplementation(err));
  }
};
