import Joi from 'joi';
import merge from 'lodash/merge';

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

const validateExpertFilter = {
  validate: {
    query: {
      filter: Joi.string().allow(''),
    },
  },
};

const experts = [
  // Get a list of all experts
  {
    method: 'GET',
    path: '/experts',
    config: validateExpertFilter,
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
