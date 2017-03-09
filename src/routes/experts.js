import Joi from 'joi';

import {
  getExperts,
  getExpert,
} from '../controllers/experts';

const validateExpertId = {
  validate: {
    params: {
      expertId: Joi.number().integer().required(),
    },
  },
};

const experts = [
  // Get a list of all experts
  {
    method: 'GET',
    path: '/experts',
    handler: getExperts,
  },

  // Get more info about a specific expert
  {
    method: 'GET',
    path: '/experts/{expertId}',
    config: validateExpertId,
    handler: getExpert,
  },
];

export default experts;
export const routes = server => server.route(experts);
