const express = require('express');
const {userRouter}=require('./routes/user.route')
const app =express();
require('dotenv').config();


const port=

app.use(express.json());
app.use('/api/user', userRouter);
app.get("/", (req, res) => {
  res.send("Welcome to BlogZone Backend 😁");
});



