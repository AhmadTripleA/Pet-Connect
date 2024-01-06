const asyncErrorWrapper = require("express-async-handler")
const { resMsg, resErr, deleteImageFile } = require('../middlewares/general');
const Post = require('../Models/post');
const User = require("../Models/user");
const Pet = require("../Models/pet");

const addPost = asyncErrorWrapper(async (req, res, next) => {
    // Its important to use Try-Catch when deleting images
    try {
        const { userID, title, content, petID, tag, price } = req.body;

        const pet = await Pet.findById(petID);
        if (!pet) {
            return resErr(`This Pet Does not Exist in Database`, 404, res);
        }

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
const getPost = asyncErrorWrapper(async (req, res, next) => {
    const post = await Post.findById(req.body.postID)
        .populate('petID')
        .populate('userID');

    if ((!post) || post.state !== "active") {
        return resErr(`This Post Does not Exist!`, 404, res);
    }
    res.status(200).json(post);
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
    const { postID, content } = req.body;

    try {
        const post = await Post.findById(postID);

        if (!post) {
            return resErr(`This Post Doesn't Exist`, 404, res);
        }

        console.log(post);

        const newComment = {
            userID: req.user._id,
            name: req.user.name,
            content: content,
            profilePic: req.user.profilePic,
            date: Date.now(),
        };

        post.comments.push(newComment);
        await post.save();

        const updatedPost = await Post.findById(postID);
        res.status(200).json(updatedPost);

        console.log('Comment Added & Updated Post Delievered');
    } catch (err) {
        resErr(`Error adding comment - ${err.message}`, 400, res);
    }
})

const deleteComment = asyncErrorWrapper(async (req, res, next) => {
    const { postID, commentID } = req.body;

    const post = await Post.findById(postID);
    if ((!post) || post.state !== "active") {
        return resErr('This Post Does not Exist', 404, res);
    }

    const comment = post.comments.find(comment => comment._id.toString() === commentID.toString());
    if (!comment) {
        return resErr('This Comment Does not Exist', 404, res);
    }

    console.log(`Comment Detected: ${comment.content} by ${comment.name}`);

    await Post.updateOne(
        { _id: postID },
        { $pull: { comments: { _id: commentID } } }
    )

    console.log(`Commented Deleted Successfully!`);

    const updatedPost = await Post.findById(postID);
    res.status(200).json(updatedPost);
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

const likePost = asyncErrorWrapper(async (req, res, next) => {
    const { userID, postID } = req.body;

    const post = await Post.findById(postID);
    if (!post || post.state !== "active") {
        return resErr(`This Post Does not Exist`, 404, res);
    }

    const isLikedByUser = post.likes.find(user => user.toString() === userID.toString());
    if (!isLikedByUser) {
        // User has not liked, so add his like
        await Post.updateOne(
            { _id: postID },
            { $addToSet: { likes: userID } }
        );
        return resMsg(`Added Like Successfully!`, 200, res);
    } else {
        // User has liked, so remove his like
        await Post.updateOne(
            { _id: postID },
            { $pull: { likes: userID } }
        );
        return resMsg(`Removed Like Successfully!`, 200, res);
    }
})

module.exports = {
    addPost,
    addComment,
    deleteComment,
    getComments,
    likePost,
    getPost,
    getAll,
    getByTag,
    deletePost
}