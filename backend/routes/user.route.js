const express = require('express');
const {  signUp , userLogin }=require('../controllers/userController');

const userRouter=express.Router();

userRouter.post('/signUp',signUp);
userRouter.post('/login',userLogin);

module.exports={userRouter}