import Boom from 'boom';
import {
  dbGetAllFeedback,
  dbGetFeedback,
  dbCreateFeedback,
  dbDelFeedback,
} from '../models/feedback';

import sendMail from '../utils/email';
import config from '../utils/config';

/*
import {
  dbGetUser,
} from '../models/users';
*/

// ADMIN ONLY
export const getAllFeedback = (request, reply) => dbGetAllFeedback().then(reply);
// ADMIN ONLY
export const getFeedback = (request, reply) => dbGetFeedback(request.params.feedbackId).then(reply);
// ADMIN ONLY
export const delFeedback = (request, reply) => dbDelFeedback(request.params.feedbackId).then(reply);

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

    const { text, ...metadata } = request.payload;

    reply({
      message: 'Thank you for sending feedback to XPRT.',
    });

    return sendMail({
      to: config.adminEmail,
      subject: 'XPRT app feedback',
      text: `Feedback text: '${text}'\n` +
            `Metadata: ${JSON.stringify(metadata, null, 4)}`,
    });
  } catch (e) {
    return reply(Boom.badImplementation(e));
  }
};
