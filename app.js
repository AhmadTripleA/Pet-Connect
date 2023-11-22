const express = require('express');
const mongoose = require('mongoose'); // Database
const morgan = require('morgan'); // logging
const bodyParser = require('body-parser'); // JSON parsing
const path = require('path'); // For working with file paths
const { resMsg, parseText } = require('./middlewares/general');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB (replace 'your-database-name' with your database name)
mongoose.connect('mongodb://127.0.0.1:27017/MRC', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests in simple format 
app.use(morgan('Method=:method Endpoint=:url Status=:status Time=:response-time ms - :date[web]\n=============================='));

mongoose.models = {};

app.use('/users', require('./Routers/userRouter'));
app.use('/posts', require('./Routers/postRouter'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'documentation.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is now running on port ${port}`);
});