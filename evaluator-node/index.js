import express from 'express';
import cors from 'cors';
import { corsConfig, db } from '../config/config.js';
import mailRouter from './routes/mailRoutes.js';
import MongoStore from 'connect-mongo'
import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan'
import quizRouter from './routes/quizRoutes.js';
import '../config/passport.js';
import mongoose from 'mongoose';
const app = express();
const PORT = 3001;

mongoose.connect(process.env.URI)
.then(()=>console.log("Connected"))
.catch((e) => console.log(e));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.URI }),
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(express.json());
app.use(cors(corsConfig));
app.use(morgan('dev'))


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('/' , (req,res) => {res.json({message : "Evaluator working fine"})})
app.use('/api/v4/mail', mailRouter);


// app.use((req,res,next) => {
//    if(req.isAuthenticated()) next();
//    else res.status(401).json({message: "Unauthorised"})
// })


app.use('/api/v4/eval/quiz', quizRouter); 
// app.use('/api/v4/eval/test' ,)


app.listen(PORT , () => {
  console.log(`Server live at http://localhost:${PORT}`);
})
