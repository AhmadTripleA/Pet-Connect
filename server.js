import dotenv from "dotenv";
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import chalk from "chalk";
import customErrorHandler from './middlewares/errors/customErrorHandler.js';
import { imgPath, __dirname } from './middlewares/general.js';

dotenv.config({
  path: './config/config.env'
})

const app = express();
const port = process.env.PORT || 6000;

import { connectDB } from "./middlewares/database.js";
connectDB();

app.use('/public', express.static('./public'));
app.use('/uploads/images', express.static(imgPath));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Clear database model cache
mongoose.models = {};

import indexRouter from './Routers/index.js';
app.use('/api', indexRouter);

// this middleware takes whatever errors thrown during runtime and logs them
app.use(customErrorHandler);

const morganStyle = chalk.gray('===> :method End=:url Status=:status Time=:response-time ms - :date[web]');
app.use(morgan(morganStyle));

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is now running on port ${port}`);
});