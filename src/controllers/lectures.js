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

export const getTeacherLectures = (request, reply) => dbGetTeacherLectures(request.pre.user.id).then(reply);
export const getExpertLectures = (request, reply) => dbGetExpertLectures(request.pre.user.id).then(reply);

export const getLectures = (request, reply) => {
  if (request.pre.user.scope !== 'admin') {
    return reply(Boom.unauthorized('Unprivileged user!'));
  }
  dbGetLectures(request.query.filter)
    .then(reply)
    .catch((err) => {
      reply(Boom.badImplementation(err));
    });
};

export const getLecture = (request, reply) => dbGetLecture(request.params.lectureId).then(reply);
export const createLecture = async (request, reply) => {
  try {
    const lecture = await dbCreateLecture(
      request.pre.user.id,
      {
        ...request.payload,
        subjects: request.payload.subjects && JSON.stringify(request.payload.subjects),
        statusDate: new Date(),
      },
    );

    dbGetLecture(lecture.id)
      .then(async (createdLecture) => {
        reply(createdLecture);

        const expert = await dbGetUser(createdLecture.expertId);
        sendMail({
          to: expert.email,
          subject: 'Lecture invitation received',
          text: 'You have been sent a lecture invitation',
        });
      })
      .catch(err => console.log('Error while sending lecture invitation e-mail', err));
  } catch (e) {
    reply(Boom.badImplementation(e));
  }
};

export const updateLecture = async (request, reply) => {
  const user = await dbGetUser(
    request.pre.user.id,
  );

  if (request.pre.user.scope !== 'admin') {
    if (!user.isTeacher) {
      return reply(Boom.forbidden('User is not a teacher'));
    }
  }

  // const oldLecture = await dbGetLecture(request.params.lectureId);

  try {
    await dbUpdateLecture(
      request.pre.user.id,
      request.params.lectureId,
      {
        ...request.payload,
        subjects: request.payload.subjects && JSON.stringify(request.payload.subjects),
      },
    );

    dbGetLecture(request.params.lectureId)
      .then(async (updatedLecture) => {
        reply(updatedLecture);

        const diffKeys = reduce(request.payload, (result, value, key) =>
          (isEqual(value, updatedLecture[key]) ? result : result.concat(key))
        , []);

        const expert = await dbGetUser(updatedLecture.expertId);
        sendMail({
          to: expert.email,
          subject: 'Lecture invitation changed',
          text: `Teacher '${user.name}' has modified your lecture invitation` +
                // TODO: more user friendly
                `Changed fields: ${JSON.stringify(diffKeys, null, 4)}\n\n` +
                `Manage your invitations at ${config.frontendUrl}/profile`,
        });
      })
      .catch(err => console.log('Error while sending lecture change e-mail', err));
  } catch (e) {
    reply(Boom.badImplementation(e));
  }
};

// Controller for handling invitation status updates by experts
export const changeInvitationStatus = async (request, reply) => {

  const user = await dbGetUser(
    request.pre.user.id,
  );
  const lecture = await dbGetLecture(
    request.params.lectureId,
  );
  if (!lecture) {
    return reply(Boom.forbidden('Lecture not found'));
  }

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

  try {
    await dbUpdateLectureExpert(
      request.pre.user.id,
      request.params.lectureId,
      fields,
    );

    dbGetLecture(request.params.lectureId)
      .then(async (updatedLecture) => {
        reply(updatedLecture);

        const teacher = await dbGetUser(updatedLecture.teacherId);
        const changedStatus = updatedLecture.status === 'rejected' ? 'canceled' : updatedLecture.status;
        sendMail({
          to: teacher.email,
          subject: `Lecture invitation ${updatedLecture.status} by ${user.name}`,
          text: `${user.name} has ${changedStatus} your lecture invitation.\n\n` +
                `Manage your invitations at ${config.frontendUrl}/profile`
          ,
        });
      })
      .catch(err => console.log('Error while sending lecture change e-mail', err));
  } catch (e) {
    reply(Boom.badImplementation(e));
  }
};

export const delLecture = (request, reply) => dbDelLecture(request.pre.user.id, request.params.lectureId).then(reply);
