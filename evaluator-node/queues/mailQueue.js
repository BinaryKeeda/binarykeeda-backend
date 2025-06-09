import { Queue } from 'bullmq';
import { config } from 'dotenv';
config();

const connection = { host: 'localhost', port: 6379 };

export const jobQueue = new Queue('job-queue', { connection });



