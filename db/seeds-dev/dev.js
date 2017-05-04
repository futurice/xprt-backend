const fixtureFactory = require('fixture-factory');

// 'foobar'
const dummyPassword = '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

fixtureFactory.register('user', {
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
  company: 'lorem.sentence',
  details: 'lorem.sentence',
  address: 'address.streetAddress',
  phone: 'phone.phoneNumber',

  area: (fixtures, options, dataModel, faker) => (
    JSON.stringify([faker.address.country(), faker.address.country()])
  ),

  subjects: (fixtures, options, dataModel, faker) => (
    JSON.stringify([faker.random.word(), faker.random.word(), faker.random.word()])
  ),

  isExpert: () => Math.floor(Math.random() * 2),
  isTeacher: () => Math.floor(Math.random() * 2),
});


fixtureFactory.register('lecture', {
  createdAt: 'date.recent',
  title: 'lorem.words',
  description: 'lorem.sentence',
  status: () => ([
    'pending',
    'accepted',
    'rejected',
    'completed',
    'canceled',
  ][Math.floor(Math.random() * 5)]),
  statusDate: 'date.recent',
  dateOption1: 'date.future',
  dateOption2: 'date.future',
  teacherNote: 'lorem.sentence',
  expertNote: 'lorem.sentence',
  edStage: 'lorem.sentence',
  teacherId: () => Math.floor(Math.random() * 10+1),
  expertId: () => Math.floor(Math.random() * 10+1),
  contactByEmail: true,
  contactByPhone: true,
  location: 'address.city',
  school: 'lorem.words',
  subjects: 'lorem.words',
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
  isTeacher: true,
  isExpert: true,
};

exports.seed = knex => (
  knex('users')
    .insert(testUser)
    .then(() => knex.batchInsert('users', fixtureFactory.generate('user', 30)))
    .then(() => knex.batchInsert('lectures', fixtureFactory.generate('lecture', 50)))
    .then(() => knex.batchInsert('feedback', fixtureFactory.generate('feedback', 10)))
);
