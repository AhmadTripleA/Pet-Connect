const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    title: String,
    content: String,
    date: Date,
    images: {
        type: [String], // Defines an array of image locations
        default: [], // Default value is an empty array
    },
    tags: {
        type: [String], // Defines an array of tags
        default: [], // Default value is an empty array
    },
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;