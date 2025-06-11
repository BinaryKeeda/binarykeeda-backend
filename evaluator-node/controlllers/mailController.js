import { USER_JWT_SECRET } from "../../config/config.js";
import Users from "../../models/core/User.js";
import { mainQueue } from "../queues/mainQueue.js";
import { getMailTemplate } from "../utils/getTemplate.js";
import jwt from 'jsonwebtoken'
export const signUpRequest = async (req,res) => {
    try {
        const {email} = req.body;
        let user = await Users.findOne({email});
        // console.log()
        if(user && user.isVerified) return res.status(400).json({message: "Email already exists"});
        if(!user) {
            user = new Users({email:email});
        }
        const token = jwt.sign({ email }, USER_JWT_SECRET, { expiresIn: "10m" });
        const verifyLink = `${process.env.REDIRECT_URL}/verify/${encodeURIComponent(token)}`;
        user.verificationToken = token;
        user.save();
        const mailData = {
            from: `"Binary Keeda" <${process.env.EMAIL}>`,
            to: email,
            subject: "Your sign up Link",
            html: getMailTemplate(verifyLink,1)
        }
        mainQueue.add('sendMail' , mailData , {priority:5});
        res.status(200).json({message: "Email sent successfully"});
    }
    catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const resetPassword = async (req , res) => {
    try {
        const {email} = req.body;
        let user = await Users.findOne({email});
        if(!user) return res.status(400).json({message: "Email does not exist"});

        const token = jwt.sign({ email }, USER_JWT_SECRET, { expiresIn: "10m" });
        const verifyLink = `${process.env.REDIRECT_URL}/verify/${encodeURIComponent(token)}`;
        user.verificationToken = token;
        user.save();
        const mailData = {
            from: `"Binary Keeda" <${process.env.EMAIL}>`,
            to: email,
            subject: "Your password reset link is here",
            html: getMailTemplate(verifyLink,2)
        }
        mainQueue.add('sendMail' , mailData , {priority:5});
        res.status(200).json({message: "Email sent successfully"});
    }catch(error) {
        res.status(500).json({message: "Internal Server Error"});
    }

}