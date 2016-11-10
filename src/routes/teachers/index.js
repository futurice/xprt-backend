import knex from 'db';
import Boom from 'boom';

const list = {
  handler: (request, reply) => {
    knex('teachers')
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const get = {
  handler: (request, reply) => {
    knex('teachers')
    .where('id', request.params.teacherId)
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const register = {
  handler: (request, reply) => {
    knex('teachers')
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
    knex('teachers')
    .where('id', request.params.teacherId)
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
    knex('teachers')
    .where('id', request.params.teacherId)
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
    path: '/teacher',
    config: list
  }, {
    method: 'GET',
    path: '/teacher/{teacherId}',
    config: get
  }, {
    method: 'POST',
    path: '/teacher',
    config: register
  }, {
    method: 'PUT',
    path: '/teacher/{teacherId}',
    config: update
  }, {
    method: 'DELETE',
    path: '/teacher/{teacherId}',
    config: del
  }
];
