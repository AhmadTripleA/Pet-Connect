const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    image: {
        type: String,
        default: "post.png"
    },
    petID: {
        type: mongoose.Schema.ObjectId,
        ref: "Pet",
        default: {}
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    commentors: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: []
    }],
    comments: [{
        type: mongoose.Schema.ObjectId, 
        ref: "Comment",
        default: []
    }],
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;