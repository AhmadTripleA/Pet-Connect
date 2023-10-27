const express = require('express');
const mongoose = require('mongoose'); // Database
const morgan = require('morgan'); // logging
const bodyParser = require('body-parser'); // JSON parsing
const path = require('path'); // For working with file paths


const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Connect to MongoDB (replace 'your-database-name' with your database name)
mongoose.connect('mongodb://127.0.0.1:27017/MRC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/public', express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests in simple format 
app.use(morgan('Method=:method Endpoint=:url Status=:status Time=:response-time ms - :date[web]'));

app.use('/users', require('./Routers/userRouter'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});