const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: Number,
    profilePic: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;