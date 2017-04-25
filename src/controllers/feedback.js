import Boom from 'boom';
import {
  dbGetAllFeedback,
  dbGetFeedback,
  dbCreateFeedback,
  dbUpdateFeedback,
  dbDelFeedback,
} from '../models/feedback';

export const getAllFeedback = (request, reply) => dbGetAllFeedback().then(reply);
export const getFeedback = (request, reply) => dbGetFeedback(request.params.feedbackId).then(reply);
export const createFeedback = async (request, reply) => {
  try {
    await dbCreateFeedback({
      text: request.payload.text,
      creatorType: 'teacher', // TODO: for now only teachers supported
      email: request.pre.user.email, // TODO: anonymous feedback?
    });

    reply({
      message: 'Thank you for sending feedback to XPRT.',
    });
  } catch (e) {
    reply(Boom.badImplementation(e));
  }
};

// TODO: make sure user "owns" feedback (i.e. either expertId or teacherId matches userId)
export const updateFeedback = (request, reply) => dbUpdateFeedback(request.params).then(reply);
export const delFeedback = (request, reply) => dbDelFeedback(request.params.feedbackId).then(reply);
