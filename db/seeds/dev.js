/*eslint-disable func-names*/
'use strict';

let fixtureFactory = require('fixture-factory');

// 'foobar'
let dummyPassword = '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

fixtureFactory.register('expert', {
  id: 'random.number',
  createdAt: 'date.recent',
  photograph: (fixtures, options, dataModel, faker) => (
    faker.image.imageUrl() + '?' + faker.random.number()
  ),
  name: (fixtures, options, dataModel, faker) => (
    faker.name.firstName() + ' ' + faker.name.lastName()
  ),
  title: 'name.jobTitle',
  description: 'lorem.sentence',
  subjects: (fixtures, options, dataModel, faker) => (
    JSON.stringify([faker.random.word(), faker.random.word(), faker.random.word()])
  ),
  area: 'address.city',
  username: 'internet.userName',
  password: dummyPassword,
  email: 'internet.email',
  phone: 'phone.phoneNumber',
});

fixtureFactory.register('teacher', {
  id: 'random.number',
  createdAt: 'date.recent',
  photograph: (fixtures, options, dataModel, faker) => (
    faker.image.imageUrl() + '?' + faker.random.number()
  ),
  name: (fixtures, options, dataModel, faker) => (
    faker.name.firstName() + ' ' + faker.name.lastName()
  ),
  title: 'name.jobTitle',
  school: 'company.companyName',
  description: 'lorem.sentence',
  address: 'address.streetAddress',
  username: 'internet.userName',
  password: dummyPassword,
  email: 'internet.email',
  phone: 'phone.phoneNumber',
});

fixtureFactory.register('admin', {
  id: 'random.number',
  createdAt: 'date.recent',
  username: 'internet.userName',
  password: dummyPassword,
  email: 'internet.email',
});

fixtureFactory.register('lecture', {
  id: 'random.number',
  createdAt: 'date.recent',
  title: 'lorem.words',
  description: 'lorem.sentence',
  dates: 'date.future',
  teacherNote: 'lorem.sentence',
  expertNote: 'lorem.sentence',
  targetStudents: 'lorem.sentence',
  creatorId: 'random.number',
  creatorType: (fixtures, options, dataModel, faker) => (
    Math.random() < 0.5 ? 'teacher' : 'expert'
  ),
  area: 'address.city',
});

fixtureFactory.register('feedback', {
  createdAt: 'date.recent',
  id: 'random.number',
  text: 'lorem.sentences',
  creatorType: (fixtures, options, dataModel, faker) => (
    Math.random() < 0.5 ? 'teacher' : 'expert'
  ),
  email: 'internet.email',
});

exports.seed = function(knex) {
  return knex
  .batchInsert('experts', fixtureFactory.generate('expert', 10))
  .then(() => {
    return knex.batchInsert('teachers', fixtureFactory.generate('teacher', 10));
  })
  .then(() => {
    return knex.batchInsert('admins', fixtureFactory.generate('admin', 3));
  })
  .then(() => {
    return knex.batchInsert('lectures', fixtureFactory.generate('lecture', 50));
  })
  .then(() => {
    return knex.batchInsert('feedback', fixtureFactory.generate('feedback', 10));
  });
};
