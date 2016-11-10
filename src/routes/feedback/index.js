import knex from 'db';
import Boom from 'boom';

const list = {
  handler: (request, reply) => {
    knex('feedback')
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const get = {
  handler: (request, reply) => {
    knex('feedback')
    .where('id', request.params.expertId)
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const register = {
  handler: (request, reply) => {
    knex('feedback')
    .insert(request.payload)
    .returning('*')
    .then(reply)
    .catch(function(err) {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const del = {
  handler: (request, reply) => {
    knex('feedback')
    .where('id', request.params.expertId)
    .del()
    .returning('*')
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

export default [
  {
    method: 'GET',
    path: '/feedback',
    config: list
  }, {
    method: 'GET',
    path: '/feedback/{feedbackId}',
    config: get
  }, {
    method: 'POST',
    path: '/feedback',
    config: register
  }, {
    method: 'DELETE',
    path: '/feedback/{feedbackId}',
    config: del
  }
];
