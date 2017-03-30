import {
  dbGetLectures,
  dbGetLecture,
  dbCreateLecture,
  dbUpdateLecture,
  dbDelLecture,
} from '../models/lectures';

export const getLectures = (request, reply) => {
  console.log(request);
  return dbGetLectures().then(reply);
};

export const getLecture = (request, reply) => dbGetLecture(request.params.lectureId).then(reply);
export const createLecture = (request, reply) => dbCreateLecture(request.params).then(reply);

// TODO: make sure user "owns" lecture (i.e. either expertId or teacherId matches userId)
export const updateLecture = (request, reply) => dbUpdateLecture(request.params).then(reply);
export const delLecture = (request, reply) => dbDelLecture(request.params.lectureId).then(reply);
