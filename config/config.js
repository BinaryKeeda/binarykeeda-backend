import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();
export const USER_JWT_SECRET = "FDSHHSDJDS";
export const ADMIN_JWT_SECRET = "shgdsjdsjds";
export const CALLBACK = ""
export const corsConfig = {
    origin: ['https://binarykeeda.com' ,'https://www.binarykeeda.com' , 'http://localhost:5173'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
export const db = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.URI, {})
            .then(() => {
                console.log("Connected to MongoDB");
                resolve();
            })
            .catch((err) => {
                console.log("Error connecting to MongoDB");
                reject(err);
            });
    })
}

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };


export const redisConnection = {
  host: 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD
};



export const MAIL_JOB = 'sendMail';
export const TEST_EVAL = 'testEval';
export const QUIZ_EVAL = 'quizEval';