import knex from 'db';
import Boom from 'boom';

const list = {
  handler: (request, reply) => {
    knex('lectures')
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const get = {
  handler: (request, reply) => {
    knex('lectures')
    .first()
    .where('id', request.params.lectureId)
    .then(reply)
    .catch(err => {
      reply(Boom.badImplementation('Database error', err));
    });
  }
};

const register = {
  handler: (request, reply) => {
    knex('lectures')
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
    knex('lectures')
    .where('id', request.params.lectureId)
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
    knex('lectures')
    .where('id', request.params.lectureId)
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
    path: '/lectures',
    config: list
  }, {
    method: 'GET',
    path: '/lectures/{lectureId}',
    config: get
  }, {
    method: 'POST',
    path: '/lectures',
    config: register
  }, {
    method: 'PUT',
    path: '/lectures/{lectureId}',
    config: update
  }, {
    method: 'DELETE',
    path: '/lectures/{lectureId}',
    config: del
  }
];
