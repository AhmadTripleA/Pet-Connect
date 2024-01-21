import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    writerID: {
        type: mongoose.Schema.ObjectId,
        ref: "Writer",
        required: true
    },
    author: {
        type: String,
        required: true,
        default: "أليفنا"
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [4, "Please provide a title least 4 characters "],
        default: "Article Title"
    },
    content: {
        type: String,
        default: "Article Content"
    },
    image: {
        type: String,
        default: "article.png"
    },
    date: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        enum: ["active", "deleted", "archived"],
        default: "active"
    }

}, { timestamps: true }) // adds automated fields to DB to track modificiations

const Article = mongoose.model("Article", articleSchema)

export default Article;