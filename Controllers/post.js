import asyncErrorWrapper from 'express-async-handler';
import { resMsg, resErr, deleteImageFile } from '../middlewares/general.js';
import Post from '../Models/post.js';
import Pet from '../Models/pet.js';

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
        resMsg(`Post by ${req.user.name} Added Successfully!`, 200, res);
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
    console.log(`Post with id:${post._id} Sent!`);
})

const getAll = asyncErrorWrapper(async (req, res, next) => {
    let limit = req.body.limit;

    if (!limit) {
        limit = 15;
    }

    const posts = await Post.find({
        state: "active"
    })
        .sort({ createdAt: -1 })
        .populate('petID')
        .populate('userID')
        .limit(limit);

    // send empty insted of null
    if (!posts) {
        posts = []
    }
    res.status(200).json(posts);
    console.log(`Sent ${posts.length} Posts!`);
})

const getByTag = asyncErrorWrapper(async (req, res, next) => {
    const tag = req.body.tag;
    let limit = req.body.limit;

    if (!limit) {
        limit = 15;
    }

    if (!tag) {
        tag = 'social';
    }

    const posts = await Post.find({
        $and: [
            { tag: tag },
            { state: "active" }
        ]
    })
        .sort({ createdAt: -1 })
        .populate('petID')
        .populate('userID')
        .limit(limit);

    // send empty instead of null
    if (!posts) {
        posts = [];
    }

    res.status(200).json(posts);
    console.log(`Sent ${posts.length} Posts by Tag: ${tag}!`)
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
        resMsg(`Post ${post._id} Deleted Successfully!`, 200, res);
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

        console.log(`Comment (${content}) Added by ${newComment.name}!`);
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

    if (comment.userID.toString() !== req.user._id.toString()) {
        return resErr('This Comment Does not Belong to You', 404, res);
    }

    await Post.updateOne(
        { _id: postID },
        { $pull: { comments: { _id: commentID } } }
    )

    console.log(`Comment: (${comment.content}) Deleted by ${comment.name}!`);

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
        return resMsg(`Added Like from ${post._id} Successfully!`, 200, res);
    } else {
        // User has liked, so remove his like
        await Post.updateOne(
            { _id: postID },
            { $pull: { likes: userID } }
        );
        return resMsg(`Removed Like from from ${post._id} Successfully!`, 200, res);
    }
})

const getRecentPostsByTag = asyncErrorWrapper(async (req, res, next) => {
    try {
        const recentPostsByTag = await Post.aggregate([
            {
                $sort: { tag: -1, createdAt: -1 }
            },
            {
                $group: {
                    _id: "$tag",
                    posts: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    tag: "$_id",
                    posts: { $slice: ["$posts", 2] }
                }
            },
            {
                $unwind: "$posts"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "posts.userID",
                    foreignField: "_id",
                    as: "posts.userID"
                }
            },
            {
                $unwind: "$posts.userID"
            },
            {
                $lookup: {
                    from: "pets",
                    localField: "posts.petID",
                    foreignField: "_id",
                    as: "posts.petID"
                }
            },
            {
                $unwind: { path: "$posts.petID", preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: "$tag",
                    posts: { $push: "$posts" }
                }
            }
        ]);

        // resMsg(recentPostsByTag, 200, res);
        res.status(200).json({ Message: recentPostsByTag });
    } catch (error) {
        return resErr(error, 400, res);
    }
});

const filterPosts = asyncErrorWrapper(async (req, res, next) => {
    const { query, limit } = req.body;

    const posts = await Post.find({
        $or: [
            { content: { $regex: query, $options: 'i' } },
            { title: { $regex: query, $options: 'i' } },
            { 'petID.breed': { $regex: query, $options: 'i' } }
        ]
    })
        .populate('petID')
        .populate('userID')
        .sort({ createdAt: -1 })
        .limit(limit);

    console.log(`Filter: ${query} | limit: ${limit} | ${posts.length} Posts Sent`);
    res.status(200).json(posts);
})

const getPosts = asyncErrorWrapper(async (req, res, next) => {
    const posts = await Post.find();
    res.status(200).json(posts);
})

export default {
    addPost,
    addComment,
    deleteComment,
    getComments,
    likePost,
    getPost,
    getAll,
    getByTag,
    deletePost,
    getRecentPostsByTag,
    filterPosts,
    getPosts
}