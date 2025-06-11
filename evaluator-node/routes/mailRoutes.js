import { Router } from "express";
import  { mainQueue} from '../queues/mainQueue.js';
import { resetPassword, signUpRequest } from "../controlllers/mailController.js";
import { signupLinkLimiter } from "../../config/rateLimiter.js";
const mailRouter = Router();

mailRouter.post('/signup/requested',signupLinkLimiter, signUpRequest);
mailRouter.get('/signup/success', async (req, res) => {});
mailRouter.post('/forget-password', signupLinkLimiter,resetPassword);


export default mailRouter;