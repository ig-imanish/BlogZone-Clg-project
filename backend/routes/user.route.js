const express = require("express");
const {
  signUp,
  userLogin,
  getUserProfileByUsername,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/login", userLogin);
// Public profile by username
userRouter.get("/profile/:username", getUserProfileByUsername);

module.exports = { userRouter };
