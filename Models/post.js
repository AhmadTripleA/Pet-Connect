const mongoose = require('mongoose');

// Embedded Comment Schema
const commentSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        default: "username"
    },
    content: {
        type: String,
        required: true,
        default: "content"
    },
    profilePic: {
        type: String,
        required: true,
        default: "default_user_icon.png"
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true },);

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
    },
    date: {
        type: Date,
        default: Date.now
    },
    tag: {
        type: String,
        enum: ["social", "trading", "adoption", "lost", "mating"],
        default: "social",
        required: true,
    },
    price: {
        type: Number,
        required: false,
        getters: true
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: [],
    }],
    comments: {
        type: [commentSchema],
        default: []
    },
    state: {
        type: String,
        enum: ["active", "deleted", "archived"],
        default: "active"
    }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;