const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/userModel');
const Post = require('../Models/postModel');
const { resMsg, resErr, imgPath } = require('../middlewares/general');

const addPost = asyncErrorWrapper(async (req, res, next) => {

    const { userID, title, content, petID } = req.body;

    const image = await req.file.filename;

    console.log(image)

    const post = new Post({
        userID,
        title,
        content,
        petID,
        image
    });

    await post.save();

    resMsg("Post Added Successfully!", 200, res);
})

const getAll = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findById(req.body.userID);

    if (!user) {
        resErr("Authentication Failed", 400, res);
    }

    const posts = await Post.find()
    .populate('petID')
    .populate('userID');

    res.status(200).json(posts);
})

module.exports = {
    addPost,
    getAll
}