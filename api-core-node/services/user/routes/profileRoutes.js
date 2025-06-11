import { Router } from "express";
import axios from 'axios'
import { completeProfile, fetchUniversity } from "../controllers/profileControllers.js";
import Users from "../../../../models/core/User.js";
const profileRouter = Router();

profileRouter.get('/university/:name/', fetchUniversity);
profileRouter.put('/profile/complete' , async (req,res) => {
    try {
      const { id,name, email , avatar,yearOfGraduation ,phone,specialisation,password,program,semester, university} = req.body;
      const user = req.user
      if(user._id != id) {
        return res.status(401).json({ message: "You are not authorized to complete this profile" });
      }
      
      const newUser = await Users.findByIdAndUpdate(id, {
        $set: {
          name,
          email,
          avatar,
          yearOfGraduation,
          phone,
          specialisation,
          program,
          semester,
          university
          },
      })
      if(newUser.googleId) {
        newUser.password = password;
      }
      newUser.profileCompleted = true;
      newUser.save();
      return res.json({user :newUser});

    } catch (error) {
      console.log(error)
      return res.json({e:error})
    }
});

export default profileRouter;