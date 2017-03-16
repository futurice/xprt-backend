import {
  dbGetExperts,
  dbGetExpert,
} from '../models/experts';

export const getExperts = (request, reply) => dbGetExperts(request.query.filter).then(reply);
export const getExpert = (request, reply) => dbGetExpert(request.params.expertId).then(reply);
