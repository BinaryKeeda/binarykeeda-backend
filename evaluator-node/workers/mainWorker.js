import { Worker } from 'bullmq';
// import os from 'os';
import { redisConnection } from '../../config/config.js';
import { mailSender } from './helpers/mailSender.js';

// const cpuCount = os.cpus().length;
// const concurrency = Math.floor(cpuCount * 0.7); // 70% of cores
// console.log(cpuCount)
const worker = new Worker(
  'mainQueue',
  async (job) => {
    switch (job.name) {
      case 'testEval':
        console.log('Evaluating test');
        break;

      case 'quizEval':
        console.log('Evaluating quiz');
        break;

      case 'sendMail':mailSender(job);
      break;
      default:
        console.warn(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} of type ${job.name} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

