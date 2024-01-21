import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import customErrorHandler from './middlewares/errors/customErrorHandler.js';
import { imgPath } from './middlewares/general.js';

// Environment Variable File Config (must be 1st priority)
dotenv.config({
  path: './config/config.env'
})

const app = express();
const port = process.env.PORT || 6000;

// REMOVE THIS ON BUILD
// mongoose.set('debug', true);

// Connect to MongoDB URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Express static serving routes
app.use('/public', express.static('./public'));
app.use('/uploads/images', express.static(imgPath));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Log all incoming requests in simple format 
const morganStyle = '===> :method End=:url Status=:status Time=:response-time ms - :date[web]';
app.use(morgan(morganStyle));

// Clear database model cache
mongoose.models = {};

// Index containing all the Routes
import indexRouter from './Routers/index.js';
app.use('/', indexRouter);

// this middleware takes whatever errors thrown during runtime and logs them
app.use(customErrorHandler);

app.get('/termsofuse', (req, res) => {
  res.sendFile('./public/termsofuse.html');
});
app.get('/privacypolicy', (req, res) => {
  res.sendFile('./public/privacypolicy.html');
});
app.get('/documentation', (req, res) => {
  res.sendFile('./public/documentation.html');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is now running on port ${port}`);
});