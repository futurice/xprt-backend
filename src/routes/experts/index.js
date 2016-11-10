import knex from 'db';
import Boom from 'boom';

const list = {
  handler: (request, reply) => {
    knex('experts')
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const get = {
  handler: (request, reply) => {
    knex('experts')
    .where('id', request.params.expertId)
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const register = {
  handler: (request, reply) => {
    knex('experts')
    .insert(request.payload)
    .returning('*')
    .then(reply)
    .catch(function(err) {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const update = {
  handler: (request, reply) => {
    knex('experts')
    .where('id', request.params.expertId)
    .update(request.payload)
    .returning('*')
    .then(reply)
    .catch(function(err) {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const del = {
  handler: (request, reply) => {
    knex('experts')
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
    path: '/expert',
    config: list
  }, {
    method: 'GET',
    path: '/expert/{expertId}',
    config: get
  }, {
    method: 'POST',
    path: '/expert',
    config: register
  }, {
    method: 'PUT',
    path: '/expert/{expertId}',
    config: update
  }, {
    method: 'DELETE',
    path: '/expert/{expertId}',
    config: del
  }
];
