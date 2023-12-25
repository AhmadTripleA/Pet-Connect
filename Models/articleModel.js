const mongoose = require("mongoose")

const articleSchema = new mongoose.Schema({

    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [4, "Please provide a title least 4 characters "],
    },
    content: {
        type: String,
    },
    image: {
        type: String,
        default: "article.png"
    },
    date: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true }) // adds automated fields to DB to track modificiations

const Article = mongoose.model("Article", articleSchema)

module.exports = Article;