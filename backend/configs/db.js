const mongoose = require('mongoose');
// Load environment variables from .env file
require('dotenv').config();

const mongoURL = process.env.mongo_URL;

const connection=mongoose.connect(mongoURL);
module.exports = { connection };