import asyncErrorWrapper from "express-async-handler";
import User from '../Models/user.js';
import Post from '../Models/post.js';

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(users);
})

const getActiveUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find({ state: "active" })
        .sort({ createdAt: -1 });
    res.status(200).json(users);
})

const getActivePosts = asyncErrorWrapper(async (req, res, next) => {
    const posts = await Post.find({ state: "active" })
        .sort({ createdAt: -1 });
    res.status(200).json(posts);
})

const getAllPosts = asyncErrorWrapper(async (req, res, next) => {
    const posts = await Post.find();
    res.status(200).json(posts);
})

export default {
    getAllUsers,
    getActiveUsers,
    getAllPosts,
    getActivePosts,
}