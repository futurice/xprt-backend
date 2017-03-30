const fixtureFactory = require('fixture-factory');

// 'foobar'
const dummyPassword = '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

fixtureFactory.register('user', {
  id: 'random.number',
  createdAt: 'date.recent',
  scope: 'user',

  name: (fixtures, options, dataModel, faker) => (
    `${faker.name.firstName()} ${faker.name.lastName()}`
  ),
  email: 'internet.email',
  password: dummyPassword,
  locale: 'fi',
  description: 'lorem.sentence',

  imageUrl: (fixtures, options, dataModel, faker) => (
    `${faker.image.imageUrl().replace(/^http/, 'https')}?${faker.random.number()}`
  ),

  title: 'name.jobTitle',
  address: 'address.streetAddress',
  phone: 'phone.phoneNumber',

  area: (fixtures, options, dataModel, faker) => (
    JSON.stringify([faker.address.country(), faker.address.country()])
  ),

  subjects: (fixtures, options, dataModel, faker) => (
    JSON.stringify([faker.random.word(), faker.random.word(), faker.random.word()])
  ),
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
  teacherId: 'random.number',
  area: 'address.city',
});

fixtureFactory.register('feedback', {
  id: 'random.number',
  createdAt: 'date.recent',
  text: 'lorem.sentences',

  creatorType: () => (
    Math.random() < 0.5 ? 'teacher' : 'expert'
  ),

  email: 'internet.email',
});

// Generate one test admin user
const testUser = {
  ...fixtureFactory.generateOne('user'),

  email: 'foo@bar.com',
  scope: 'admin',
};

exports.seed = knex => (
  knex('users')
    .insert(testUser)
    .then(() => knex.batchInsert('users', fixtureFactory.generate('user', 30)))
    .then(() => knex.batchInsert('lectures', fixtureFactory.generate('lecture', 50)))
    .then(() => knex.batchInsert('feedback', fixtureFactory.generate('feedback', 10)))
);
