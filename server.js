const express = require('express');
const mongoose = require('mongoose'); // Database
const morgan = require('morgan'); // logging
const bodyParser = require('body-parser'); // JSON parsing (rarely works)
const path = require('path'); // For working with file paths
const cors = require('cors'); // for sending shit to frontend (React) idk tbh
const dotenv = require("dotenv"); // for handling config environment files
const customErrorHandler = require('./middlewares/errors/customErrorHandler'); 

dotenv.config({
  path:  './config/config.env'
})

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Log all incoming requests in simple format 
app.use(morgan('Method=:method Endpoint=:url Status=:status Time=:response-time ms - :date[web]\n=============================='));

// Clear database model cache
mongoose.models = {};

app.use('/users', require('./Routers/userRouter'));
app.use('/posts', require('./Routers/postRouter'));
app.use('/pets', require('./Routers/petRouter'));

// this middleware takes whatever errors thrown during runtime and logs them
app.use(customErrorHandler);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});