import { getUserQuizes, getUserSolution } from './controllers/quizFetch.js';
import { getUserTest } from './controllers/testFetch.js';

export const resolver = {
  Query: {
    getQuizzes:getUserQuizes  ,
    getTests: getUserTest,
    getUserSolution:getUserSolution
  }
};
