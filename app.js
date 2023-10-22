const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;


// Connect to MongoDB (replace 'your-database-name' with your database name)
mongoose.connect('mongodb://127.0.0.1:27017/petcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a User model and schema
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));


// Parse form data
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests in simple format 
app.use(morgan('Method=:method Endpoint=:url Status=:status Time=:response-time ms - :date[web]'));

// DEBUGGING // Method used to debug how to decode JSON files on mobile 
app.post('/debug', async (req, res) => {
  const ahmadUser = {
    name: "ahmad akta",
    email: "ahmadakta@outlook.com",
    location: "Amman, Jordan",
    Nationality: "Syrian",
    Age: 23
  }
  res.status(200).json(ahmadUser);
  console.log("Message Sent!");
})

// Set up sessions (requires the 'express-session' middleware)
app.use(session({
  secret: '1337xdotto',
  resave: false,
  saveUninitialized: true,
}));

// Render the register/login page
app.get('/', (req, res) => {
  res.render('login-register');
});

// Register a user
app.post('/register', async (req, res) => {
  console.log(`New User: ${req.body.name}, ${req.body.email}`);
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    //res.redirect('/'); Redirect to the login/register page

    res.status(200).send('success');

  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login a user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      // Store the user ID in the session
      req.session.userId = user.id;
      res.redirect('/dashboard'); // Redirect to a dashboard or profile page
      res.status(200).send('success');
    } else {
      res.status(401).send('Invalid login credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});