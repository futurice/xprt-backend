import Boom from 'boom';
import {
  dbGetLectures,
  dbGetLecture,
  dbCreateLecture,
  dbUpdateLecture,
  dbDelLecture,
} from '../models/lectures';

export const getLectures = (request, reply) => dbGetLectures(request.pre.user.id).then(reply);

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

export const delLecture = (request, reply) => dbDelLecture(request.pre.user.id, request.params.lectureId).then(reply);
