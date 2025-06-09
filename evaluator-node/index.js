// index.js
import express from 'express';
import { config } from 'dotenv';
import { mailQueue } from './queues/mailQueue.js';
import { quizQueue } from './queues/quizQueue.js';
import { testQueue } from './queues/testQueue.js';

config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Job Producer API running');
});

app.post('/jobs/mail', async (req, res) => {
  const { to, subject, body } = req.body;
  const job = await mailQueue.add('send-mail', { to, subject, body });
  res.json({ status: 'queued', jobId: job.id });
});

app.post('/jobs/quiz', async (req, res) => {
  const { userId, answers } = req.body;
  const job = await quizQueue.add('evaluate-quiz', { userId, answers });
  res.json({ status: 'queued', jobId: job.id });
});

app.post('/jobs/test', async (req, res) => {
  const { testId, metadata } = req.body;
  const job = await testQueue.add('process-test', { testId, metadata });
  res.json({ status: 'queued', jobId: job.id });
});

import { QueueEvents } from 'bullmq';
import { connection } from './queues/connection.js';

app.get('/jobs/status/:queue/:id', async (req, res) => {
  const { queue, id } = req.params;
  let queueInstance;

  switch (queue) {
    case 'mail':
      queueInstance = mailQueue;
      break;
    case 'quiz':
      queueInstance = quizQueue;
      break;
    case 'test':
      queueInstance = testQueue;
      break;
    default:
      return res.status(400).json({ error: 'Invalid queue' });
  }

  const job = await queueInstance.getJob(id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const state = await job.getState();
  res.json({ jobId: id, state });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
