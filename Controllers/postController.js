const asyncErrorWrapper = require("express-async-handler")
const { resMsg, resErr } = require('../middlewares/general');
const Post = require('../Models/postModel');

const addPost = asyncErrorWrapper(async (req, res, next) => {

    const { userID, title, content, petID, tag, price } = req.body;

    const image = await req.file.filename;

    console.log(`New Image: ${image}`);

    const post = new Post({
        userID,
        title,
        content,
        petID,
        image,
        tag,
        price: null
    });

    await post.save();

    if (price) {
        const numericPrice = parseFloat(price);

        if (!isNaN(numericPrice)) {
            post.price = numericPrice;
            await post.save();
        } else {
            return resErr("Price is not set to a float number (parsing float failed).", 400, res);
        }
    }

    console.log(post);
    resMsg("Post Added Successfully!", 200, res);
})

const getAll = asyncErrorWrapper(async (req, res, next) => {

    const posts = await Post.find({
        state: "active"
    })
        .sort({ createdAt: -1 })
        .populate('petID')
        .populate('userID');

    res.status(200).json(posts);
})

const getByTag = asyncErrorWrapper(async (req, res, next) => {

    const tag = req.body.tag;

    const posts = await Post.find({
        $and: [
            { tag: tag },
            { state: "active" }
        ]
    })
        .sort({ createdAt: -1 })
        .populate('petID')
        .populate('userID');

    res.status(200).json(posts);
})

const deletePost = asyncErrorWrapper(async (req, res, next) => {
    const post = await Post.findById(req.body.postID);

    // Validate if the userID requesting this is the post owner
    if (!(post.userID.toString() === req.user._id.toString())) {
        return resErr('This Post Does not Belong to You', 400, res);
    }

    post.state = "deleted";
    await post.save();

    resMsg(`Post Deleted Successfully!`, 200, res);
})

module.exports = {
    addPost,
    getAll,
    getByTag,
    deletePost
}