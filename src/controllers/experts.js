import {
  dbGetExperts,
  dbGetExpert,
} from '../models/experts';

// PUBLIC
export const getExperts = (request, reply) => dbGetExperts(request.query.filter).then(reply);
// PUBLIC
export const getExpert = (request, reply) => dbGetExpert(request.params.expertId).then(reply);
