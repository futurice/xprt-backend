import Boom from 'boom';
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
  dbGetUser
} from '../models/users';

export const getTeacherLectures = (request, reply) => dbGetTeacherLectures(request.pre.user.id).then(reply);
export const getExpertLectures = (request, reply) => dbGetExpertLectures(request.pre.user.id).then(reply);

export const getLectures = (request, reply) => {
  if (request.pre.user.scope !== 'admin') {
    return reply(Boom.unauthorized('Unprivileged user!'));
  }
  dbGetLectures().then(reply);
};

export const getLecture = (request, reply) => dbGetLecture(request.params.lectureId).then(reply);
export const createLecture = async (request, reply) => {
  try {
    const lecture = await dbCreateLecture(
      request.pre.user.id,
      request.payload,
    );

    dbGetLecture(lecture.id).then(reply);
  } catch (e) {
    reply(Boom.badImplementation(e));
  }
};

export const updateLecture = async (request, reply) => {
  try {
    const lecture = await dbUpdateLecture(
      request.pre.user.id,
      request.params.lectureId,
      request.payload,
    );

    dbGetLecture(lecture.id).then(reply);
  } catch (e) {
    reply(Boom.badImplementation(e));
  }
};

export const updateInvitation = async (request, reply) => {

  const user = await dbGetUser(
    request.pre.user.id,
  );

  if (!user.isExpert) {
    return reply(Boom.forbidden('User is not an expert'));
  };

  if (user.id !== request.params.lectureId) {
    return reply(Boom.forbidden('Expert not invited to lecture'));
  };

  const fields = {
    status: request.payload.status,
  };

  try {
    const lecture = await dbUpdateLectureExpert(
      request.pre.user.id,
      request.params.lectureId,
      fields,
    );

    console.log(request.pre.user.id,
          request.params.lectureId,
          fields,);

    dbGetLecture(request.params.lectureId).then(reply);
  } catch (e) {
    reply(Boom.badImplementation(e));
  }
};

export const delLecture = (request, reply) => dbDelLecture(request.pre.user.id, request.params.lectureId).then(reply);
