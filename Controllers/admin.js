const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/user');
const Pet = require('../Models/pet');
const Post = require('../Models/post');
const { resErr, resMsg, deleteImageFile } = require('../middlewares/general');

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(users);
})

const getActiveUsers = asyncErrorWrapper(async (req, res, next) => {
    const users = await User.find({ state: "active" });
    res.status(200).json(users);
})

module.exports = {
    getAllUsers,
    getActiveUsers
}