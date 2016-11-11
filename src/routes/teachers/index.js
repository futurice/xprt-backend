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
    path: '/teachers',
    config: list
  }, {
    method: 'GET',
    path: '/teachers/{teacherId}',
    config: get
  }, {
    method: 'POST',
    path: '/teachers',
    config: register
  }, {
    method: 'PUT',
    path: '/teachers/{teacherId}',
    config: update
  }, {
    method: 'DELETE',
    path: '/teachers/{teacherId}',
    config: del
  }
];
