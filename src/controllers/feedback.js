import {
  dbGetAllFeedback,
  dbGetFeedback,
  dbCreateFeedback,
  dbUpdateFeedback,
  dbDelFeedback,
} from '../models/feedback';

export const getAllFeedback = (request, reply) => dbGetAllFeedback().then(reply);
export const getFeedback = (request, reply) => dbGetFeedback(request.params.feedbackId).then(reply);
export const createFeedback = (request, reply) => dbCreateFeedback(request.payload).then(reply);

// TODO: make sure user "owns" feedback (i.e. either expertId or teacherId matches userId)
export const updateFeedback = (request, reply) => dbUpdateFeedback(request.params).then(reply);
export const delFeedback = (request, reply) => dbDelFeedback(request.params.feedbackId).then(reply);
