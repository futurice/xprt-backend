import {
  dbGetLectures,
  dbGetLecture,
  dbCreateLecture,
  dbUpdateLecture,
  dbDelLecture,
} from '../models/lectures';

export const getLectures = (request, reply) => dbGetLectures(request.pre.user.id).then(reply);

export const getLecture = (request, reply) => dbGetLecture(request.params.lectureId).then(reply);
export const createLecture = (request, reply) => dbCreateLecture(request.pre.user.id, request.payload).then(reply);

export const updateLecture = (request, reply) => dbUpdateLecture(request.pre.user.id, request.params.lectureId, request.payload).then(reply);
export const delLecture = (request, reply) => dbDelLecture(request.pre.user.id, request.params.lectureId).then(reply);
