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
    .first()
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
    path: '/experts',
    config: list
  }, {
    method: 'GET',
    path: '/experts/{expertId}',
    config: get
  }, {
    method: 'POST',
    path: '/experts',
    config: register
  }, {
    method: 'PUT',
    path: '/experts/{expertId}',
    config: update
  }, {
    method: 'DELETE',
    path: '/experts/{expertId}',
    config: del
  }
];
