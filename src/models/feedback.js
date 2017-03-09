import knex from '../utils/db';

const feedbackSummaryFields = ['id', 'createdAt', 'title', 'dates'];
const feedbackDetailedFields = '*';

export const dbGetAllFeedback = () => (
  knex('feedback')
    .select(feedbackSummaryFields)
);

export const dbGetFeedback = id => (
  knex('feedback')
    .first(feedbackDetailedFields)
    .where({ id })
);

export const dbUpdateFeedback = (id, fields) => (
  knex('feedback')
    .update({ ...fields })
    .where({ id })
);

export const dbDelFeedback = id => (
  knex('feedback')
    .where({ id })
    .del()
);

export const dbCreateFeedback = fields => (
  knex('feedback')
    .insert(fields)
    .then(results => results[0]) // return only first result
);
