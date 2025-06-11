import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { corsConfig, db } from '../config/config.js';
import { resolver } from './graphql/resolvers/resolvers.js';
import { schema } from './graphql/schemas/schema.js';
import '../config/passport.js'; // Passport config (strategy setup)

// Routes
import authRouter from './routes/auth.js';
import profileRouter from './services/user/routes/profileRoutes.js';
import quizRouter from './services/quiz/routes/quizRoutes.js';
import morgan from 'morgan'
configDotenv(); // Load .env variables

// Connect to MongoDB
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Express App
const app = express();
const PORT = process.env.PORT || 4000;

/* =======================
   Middleware Configuration
========================== */

// 1. CORS - apply before any routes
app.use(cors(corsConfig));
app.use(morgan('dev'))
// 2. Body Parsers
app.use(express.json()); // for JSON body
app.use(express.urlencoded({ extended: true })); // for form data (optional)

// 3. Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.URI }),
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));


// 4. Passport init
app.use(passport.initialize());
app.use(passport.session());

/* =======================
   Apollo GraphQL Setup
========================== */

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver
});
await server.start();
app.use((req,res,next) => {
   if(req.isAuthenticated()) next();
   else res.status(401).json({message: "Unauthorised"})
})

app.use('/graphql', expressMiddleware(server));

/* =======================
   Routes
========================== */

// Public Auth Routes
app.use('/auth', authRouter);

// Auth Middleware
app.use((req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
});

// Protected Routes
app.use('/api', profileRouter);
app.use('/api/quiz', quizRouter);

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Server is up and running!');
});

/* =======================
   Start Server
========================== */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
