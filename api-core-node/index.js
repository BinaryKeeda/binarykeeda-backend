// const express = require('express');
// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const { typeDefs, resolvers } = require('./schema');

// const app = express();

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   await server.start();

//   app.use(
//     '/graphql',
//     cors(),
//     bodyParser.json(),
//     expressMiddleware(server)
//   );

//   app.listen(4000, () => {
//     console.log('Server running at http://localhost:4000/graphql');
//   });



import express  from 'express';
import { corsConfig, db } from '../config/config.js';
import cors from 'cors'
import authRouter from './routes/auth.js';
import { configDotenv } from 'dotenv';
import mongoose  from 'mongoose';
import MongoStore, {} from 'connect-mongo'
import passport from 'passport';
import session from 'express-session';
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { resolver } from './graphql/resolvers/resolvers.js';
import { schema } from './graphql/schemas/schema.js';
import customRouter from './routes/custom.js';

configDotenv();


mongoose.connect(process.env.URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));


const app = express();
const PORT = process.env.PORT;


/* GraphQl Setup */
const server = new ApolloServer({
  typeDefs:schema,
  resolvers: resolver,
});
await server.start();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.URI }),
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(express.json());
app.use(cors(corsConfig));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// Authentication routes
app.use('/api/v1/auth' ,authRouter);
app.use('/api/v1/custom' , customRouter);

// GraphQl Middleware
app.use('/graphql' ,  expressMiddleware(server));




app.listen(PORT, () => {
  console.log(`Server Working on ${PORT}`)
})