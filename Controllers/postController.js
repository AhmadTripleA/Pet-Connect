const asyncErrorWrapper = require("express-async-handler")
const Post = require('../Models/postModel');
const User = require('../Models/userModel');
const { resMsg, resErr } = require('../middlewares/general');

const addPost = asyncErrorWrapper(async (req, res, next) => {

    const { userID, title, content, pets } = req.body;

    // user selection here
    const user = await User.findById(userID);

    const img = await req.file.filename;

    const post = new Post({
        owner: userID,
        title,
        content,
        pets,
        image: img
    });

    await post.save();

    resMsg("Post Added Successfully!", 200, res);
})

const getAll = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findById(req.body.userID);

    if(!user){
        resErr("Authentication Failed", 400, res);
    }

    const posts = await Post.find();
    res.status(200).json(posts)
})

module.exports = {
    addPost,
    getAll
}