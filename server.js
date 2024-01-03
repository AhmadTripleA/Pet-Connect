const dotenv = require("dotenv"); // for handling config environment files
const express = require('express');
const mongoose = require('mongoose'); // Database
const morgan = require('morgan'); // logging
const bodyParser = require('body-parser'); // JSON parsing (rarely works)
const path = require('path'); // For working with file paths
const cors = require('cors'); // for sending shit to frontend (React) idk tbh
const customErrorHandler = require('./middlewares/errors/customErrorHandler'); // custom error handler instead of "catch" phrases
const { imgPath } = require('./middlewares/general');

// Environment Variable File Config (must be 1st priority)
dotenv.config({
  path: './config/config.env'
})

const app = express();
const port = process.env.PORT || 6000;

// Connect to MongoDB URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Express static serving routes
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads/images', express.static(imgPath));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Log all incoming requests in simple format 
app.use(morgan('Method=:method Endpoint=:url Status=:status Time=:response-time ms - :date[web]\n=============='));

// Clear database model cache
mongoose.models = {};

// Index containing all the Routes
app.use('/', require('./Routers/indexRouter'))

// this middleware takes whatever errors thrown during runtime and logs them
app.use(customErrorHandler);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});
app.get('/termsofuse', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'termsofuse.html'));
});
app.get('/privacypolicy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacypolicy.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is now running on port ${port}`);
});