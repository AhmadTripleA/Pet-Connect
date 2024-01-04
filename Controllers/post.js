const asyncErrorWrapper = require("express-async-handler")
const { resMsg, resErr, deleteImageFile } = require('../middlewares/general');
const Post = require('../Models/post');
const User = require("../Models/user");

const addPost = asyncErrorWrapper(async (req, res, next) => {
    try {
        const { userID, title, content, petID, tag, price } = req.body;

        // Image Processing
        const image = await req.file.filename;
        if (!image) {
            return resErr(`No Image Sent`, 400, res);
        }
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
                return resErr("Price is not a proper number", 400, res);
            }
        }

        console.log(post);
        resMsg("Post Added Successfully!", 200, res);
    } catch (err) {
        deleteImageFile(res, req.file.filename);
        return resErr(`Error Adding Post - ${err}`, 400, res);
    }

})

const getAll = asyncErrorWrapper(async (req, res, next) => {
    const posts = await Post.find({
        state: "active"
    })
        .sort({ createdAt: -1 })
        .populate('petID')
        .populate('userID');

    // send empty insted of null
    if (!posts) {
        posts = []
    }
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

    // send empty instead of null
    if (!posts) {
        posts = [];
    }

    res.status(200).json(posts);
})

const deletePost = asyncErrorWrapper(async (req, res, next) => {
    // Its important to use Try-Catch when deleting images
    try {
        const post = await Post.findById(req.body.postID);
        if (!post) {
            return resErr(`Post does not exist`, 404, res);
        }

        if (post.state === "deleted") {
            return resErr(`Post is Not Availabe`, 404, res);
        }

        // Validate if the userID requesting this is the post owner
        if (!(post.userID.toString() === req.user._id.toString())) {
            return resErr('This Post Does not Belong to You', 400, res);
        }

        // deleteImageFile(req, post.image);
        // console.log(`post image deleted`);

        await Post.updateOne({ _id: post._id }, { state: "deleted" });
        resMsg(`Post Deleted Successfully!`, 200, res);
    } catch (err) {
        resErr(`Error Deleting Post - ${err.message}`, 400, res);
    }
})

const addComment = asyncErrorWrapper(async (req, res, next) => {
    const { postID, userID, content } = req.body;

    const user = await User.findById(userID);
    const post = await Post.findById(postID);

    if (!post) {
        return resErr(`This Post Doesn't Exist`, 404, res);
    }

    const newComment = {
        userID: userID,
        name: user.name,
        content: content,
        profilePic: user.profilePic
    };

    post.comments.push(newComment);
    await post.save();

    resMsg(`New Comment By (${user.name}) Added Successfully!`, 200, res);
})

const getComments = asyncErrorWrapper(async (req, res, next) => {
    const postID = req.body.postID;
    const post = await Post.findById(postID);

    if (!post) {
        return resErr(`This Post Doesn't Exist`, 404, res);
    }

    // Sort array in descending order based on date (array.sort)
    const comments = post.comments.sort((a, b) => b.date - a.date);

    console.log(`Comments for Post:(${postID}) Sent!`);
    res.status(200).json(comments);
})

module.exports = {
    addPost,
    addComment,
    getComments,
    getAll,
    getByTag,
    deletePost
}