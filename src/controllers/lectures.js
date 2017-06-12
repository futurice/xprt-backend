import Boom from 'boom';

import reduce from 'lodash/reduce';
import isEqual from 'lodash/isEqual';

import {
  dbGetTeacherLectures,
  dbGetExpertLectures,
  dbGetLectures,
  dbGetLecture,
  dbCreateLecture,
  dbUpdateLecture,
  dbUpdateLectureExpert,
  dbDelLecture,
} from '../models/lectures';
import {
  dbGetUser,
} from '../models/users';

import sendMail from '../utils/email';
import config from '../utils/config';

// EXPERTS ONLY: Returns all lectures owned by an expert account
export const getExpertLectures = async (request, reply) => {
  try {
    const user = await dbGetUser(request.pre.user.id);

    // Check that user is a teacher (or admin)
    if (request.pre.user.scope !== 'admin') {
      if (!user.isExpert) {
        return reply(Boom.forbidden('User is not an expert'));
      }
    }

    return dbGetExpertLectures(request.pre.user.id).then(reply);
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// EXPERTS ONLY: Controller for handling invitation status updates by experts
export const changeInvitationStatus = async (request, reply) => {
  try {
    const lecture = await dbGetLecture(request.params.lectureId);
    if (!lecture) {
      return reply(Boom.notFound('Lecture not found'));
    }

    const user = await dbGetUser(request.pre.user.id);
    // Check that user is an expert and belongs to lecture
    if (request.pre.user.scope !== 'admin') {
      if (!user.isExpert) {
        return reply(Boom.forbidden('User is not an expert'));
      }

      if (user.id !== lecture.expertId) {
        return reply(Boom.forbidden('Expert not invited to lecture'));
      }
    }

    const fields = {
      status: request.payload.status,
    };

    await dbUpdateLectureExpert(
      request.pre.user.id,
      request.params.lectureId,
      fields,
    );

    return dbGetLecture(request.params.lectureId)
      .then(async (updatedLecture) => {
        reply(updatedLecture);

        const teacher = await dbGetUser(updatedLecture.teacherId);
        sendMail({
          to: teacher.email,
          subject: `Lecture invitation ${updatedLecture.status} by ${user.name}`,
          text: `${user.name} has ${updatedLecture.status} your lecture invitation.\n\n` +
                'Manage your invitations in the XPRT mobile app' +
                'Best regards,\nThe XPRT team.',
        });
      })
      .catch(err => console.log('Error while sending lecture change e-mail', err));
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// TEACHERS ONLY: Returns all lectures owned by a teacher account
export const getTeacherLectures = async (request, reply) => {
  try {
    // Check that user is a teacher (or admin)
    if (request.pre.user.scope !== 'admin') {
      if (!request.pre.user.isTeacher) {
        return reply(Boom.forbidden('User is not a teacher'));
      }
    }

    return dbGetTeacherLectures(request.pre.user.id).then(reply);
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// TEACHERS ONLY: Returns more info about a particular lecture
export const getLecture = async (request, reply) => {
  try {
    // Check that user is a teacher (or admin)
    if (request.pre.user.scope !== 'admin') {
      if (!request.pre.user.isTeacher) {
        return reply(Boom.forbidden('User is not a teacher'));
      }
    }

    // Check that user belongs to lecture (admins can access everything)
    const lecture = await dbGetLecture(request.params.lectureId);
    if (!lecture) {
      return reply(Boom.notFound('Lecture not found'));
    }

    if (request.pre.user.scope !== 'admin' &&
        request.pre.user.id !== lecture.expertId &&
        request.pre.user.id !== lecture.teacherId) {
      return reply(Boom.unauthorized('Unprivileged users may only access own lectures'));
    }

    return reply(lecture);
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// TEACHERS ONLY: Create a lecture
export const createLecture = async (request, reply) => {
  try {
    // Check that user is a teacher (or admin)
    if (request.pre.user.scope !== 'admin') {
      if (!request.pre.user.isTeacher) {
        return reply(Boom.forbidden('User is not a teacher'));
      }
    }

    const lecture = await dbCreateLecture(
      request.pre.user.id,
      {
        ...request.payload,
        subjects: request.payload.subjects && JSON.stringify(request.payload.subjects),
        statusDate: new Date(),
      },
    );

    return dbGetLecture(lecture.id)
      .then(async (createdLecture) => {
        reply(createdLecture);

        const expert = await dbGetUser(createdLecture.expertId);
        sendMail({
          to: expert.email,
          subject: 'Lecture invitation received',
          text: 'You have been sent a lecture invitation.\n\n' +
                `Manage your invitations at ${config.frontendUrl}/profile` +
                'Best regards,\nThe XPRT team.',
        });
      })
      .catch(err => console.log('Error while sending lecture invitation e-mail', err));
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// TEACHERS ONLY: Update lecture details
export const updateLecture = async (request, reply) => {
  try {
    // Check that user is a teacher (or admin)
    if (request.pre.user.scope !== 'admin') {
      if (!request.pre.user.isTeacher) {
        return reply(Boom.forbidden('User is not a teacher'));
      }
    }

    // Check that user belongs to lecture (admins can access everything)
    const lecture = await dbGetLecture(request.params.lectureId);
    if (!lecture) {
      return reply(Boom.notFound('Lecture not found'));
    }

    if (request.pre.user.scope !== 'admin' &&
        request.pre.user.id !== lecture.expertId &&
        request.pre.user.id !== lecture.teacherId) {
      return reply(Boom.unauthorized('Unprivileged users may only access own lectures'));
    }

    await dbUpdateLecture(
      request.pre.user.id,
      request.params.lectureId,
      {
        ...request.payload,
        subjects: request.payload.subjects && JSON.stringify(request.payload.subjects),
      },
    );

    return dbGetLecture(request.params.lectureId)
      .then(async (updatedLecture) => {
        reply(updatedLecture);

        const diffKeys = reduce(request.payload, (result, value, key) => {
          if (key === 'dateOption1' || key === 'dateOption2') {
            return isEqual(
              new Date(value).getTime(),
              new Date(lecture[key]).getTime(),
            ) ? result : result.concat(key);
          }

          return isEqual(value, lecture[key]) ? result : result.concat(key);
        }, []);

        let changes = '';

        diffKeys.forEach(
          key => (changes += `- ${key.charAt(0).toUpperCase()}${key.slice(1)} changed from:\n` +
                 `    ${lecture[key]}\n` +
                 '  to: \n' +
                 `    ${updatedLecture[key]}\n\n`),
        );

        const expert = await dbGetUser(updatedLecture.expertId);
        sendMail({
          to: expert.email,
          subject: 'Lecture invitation changed',
          text: `Teacher '${request.pre.user.name}' has modified your lecture invitation.\n\n` +
                // TODO: more user friendly
                `Changes: \n\n${changes}\n\n` +
                `Manage your invitations at ${config.frontendUrl}/profile\n\n` +
                'Best regards,\nThe XPRT team.',
        });
      })
      .catch(err => console.log('Error while sending lecture change e-mail', err));
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// ADMIN ONLY: Delete a lecture permanently
export const delLecture = async (request, reply) => {
  try {
    if (request.pre.user.scope !== 'admin') {
      return reply(Boom.forbidden('Unprivileged user!'));
    }

    return dbDelLecture(request.pre.user.id, request.params.lectureId).then(reply);
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// ADMIN ONLY: Returns all lectures in system
export const getLectures = (request, reply) => {
  if (request.pre.user.scope !== 'admin') {
    return reply(Boom.unauthorized('Unprivileged user!'));
  }

  return dbGetLectures(request.query.filter || {})
    .then(reply)
    .catch((err) => {
      reply(Boom.badImplementation(err));
    });
};
