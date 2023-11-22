const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        default: {}
    },
    title: String,
    content: String,
    date: Date,
    images: {
        type: [String], 
        default: [],
    },
    tags: {
        type: [String], 
        default: [], 
    },
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;