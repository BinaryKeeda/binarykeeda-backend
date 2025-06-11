import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { USER_JWT_SECRET } from "../../config/config.js";
import Users from "../../models/core/User.js";
configDotenv();
const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.REDIRECT_URL}/login` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.redirect(`${process.env.REDIRECT_URL}/signin?token=${token}`);
  }
);

authRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ msg: "Logged Out" })
  });
});

// Get Logged-In User
authRouter.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});
authRouter.post("/login", async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info.message || "Login failed" });
  
      req.login(user, (err) => {

        if (err) return next(err);
        
        // return res.redirect(`${process.env.REDIRECT_URL}`);
        return res.json({ message: "Login successful", user });
      });
    })(req, res, next);
  });

authRouter.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const decoded = jwt.verify(token, USER_JWT_SECRET);
    const user = await Users.findOne({ email: decoded.email });

    if (!user || user.verificationToken !== token) {
      return res.status(401).json({ message: "Token invalid or already used" });
    }

    // Hash password before saving (very important)

    user.password = password;
    user.verificationToken = null; // clear the token
    user.isVerified = true; // optional flag
    await user.save();

    return res.status(200).json({ message: "Your password has been set successfully" });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please request a new one.' });
    }
    res.status(400).json({ message: "Invalid or expired token" });
  }
});




export default authRouter;
