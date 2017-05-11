import Boom from 'boom';
import {
  dbGetAllFeedback,
  dbGetFeedback,
  dbCreateFeedback,
  dbUpdateFeedback,
  dbDelFeedback,
} from '../models/feedback';

/*
import {
  dbGetUser,
} from '../models/users';
*/

export const getAllFeedback = (request, reply) => dbGetAllFeedback().then(reply);
export const getFeedback = (request, reply) => dbGetFeedback(request.params.feedbackId).then(reply);

export const createFeedback = async (request, reply) => {
  try {
    const creatorType = request.payload.creatorType;

    /*
    const user = await dbGetUser(
      request.pre.user.id,
    );

    if (creatorType && creatorType === 'teacher') {
      if (!user.isTeacher) {
        return reply(Boom.forbidden("Can't create teacher feedback as non-teacher user!"));
      }
    }
    if (creatorType && creatorType === 'expert') {
      if (!user.isExpert) {
        return reply(Boom.forbidden("Can't create expert feedback as non-expert user!"));
      }
    }
    */

    await dbCreateFeedback({
      ...request.payload,
      creatorType,
    });

    return reply({
      message: 'Thank you for sending feedback to XPRT.',
    });
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};

// TODO: make sure user "owns" feedback (i.e. either expertId or teacherId matches userId)
export const updateFeedback = (request, reply) => dbUpdateFeedback(request.params).then(reply);
export const delFeedback = (request, reply) => dbDelFeedback(request.params.feedbackId).then(reply);
