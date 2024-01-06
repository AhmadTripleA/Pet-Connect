const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/user');
const Pet = require('../Models/pet');
const Post = require('../Models/post');
const bcrypt = require('bcrypt'); // For hashing passwords
const { resErr, resMsg, deleteImageFile } = require('../middlewares/general');

const addAccount = asyncErrorWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        return resErr("This Email already exists", 400, res);
    }

    const defaultPic = 'default_user_icon.png';

    const user = new User({
        name,
        email,
        password,
        profilePic: defaultPic
    });

    await user.save();

    console.log(`New User "${user.name}" Added - Email: ${user.email}`);
    res.status(200).json({ userID: user._id });

})

const addProfilePic = asyncErrorWrapper(async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userID)
        const image = req.file.filename;

        if (!image) {
            return resErr("No file found in request", 400, res);
        }

        await User.updateOne({ _id: user._id }, { profilePic: image });

        resMsg("Profile Pic Updated Successfully!", 200, res);
    } catch (err) {
        deleteImageFile(req, req.file.filename)
        resErr(`Error Updating Profile Picture - ${err}`, 400, res);
    }

})

const getProfilePic = asyncErrorWrapper(async (req, res, next) => {
    console.log('image sent!');
    res.status(200).json({ profilePic: req.user.profilePic });
})

const addPhone = asyncErrorWrapper(async (req, res, next) => {
    const phone = req.body.phone;
    req.user.phone = phone;

    await req.user.save();

    resMsg(`Phone Number ${phone} added to ${req.user.name}!`, 200, res);
})

const deletePhone = asyncErrorWrapper(async (req, res, next) => {
    await User.findOneAndUpdate({ _id: req.user._id }, { phone: "" });
    resMsg(`Phone Number Deleted from ${req.user.name}!`, 200, res);
})

const login = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return resErr("User not found", 404, res);
    }

    if (!(user.state.toString() === "active")) {
        return resErr(`This Account is no Longer Available`, 400, res);
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return resErr("Invalid password", 401, res);
    }

    res.status(200).json({
        userID: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        phone: user.phone,
    });
})

const getUser = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!(user.state.toString() === "active")) {
        return resErr(`This Account is no Longer Available`, 400, res);
    }

    const data = {
        userID: user._id,
        name: user.name,
        profilePic: user.profilePic,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        petID: await Pet.find({ userID: user._id })
            .sort({ createdAt: -1 })
    }

    res.status(200).json(data);
})

const getPets = asyncErrorWrapper(async (req, res, next) => {
    const pets = await Pet.find({
        $and: [
            { userID: req.user._id },
            { state: "active" }
        ]
    })
        .sort({ createdAt: -1 });

    return res.status(200).json(pets);
})

const getPosts = asyncErrorWrapper(async (req, res, next) => {
    const posts = await Post.find({
        $and: [
            { userID: req.user._id },
            { state: "active" }
        ]
    })
        .sort({ createdAt: -1 })
        .populate('petID')
        .populate('userID');

    return res.status(200).json(posts);
})

const deleteAccount = asyncErrorWrapper(async (req, res, next) => {
    // Its important to use Try-Catch when deleting images
    try {
        if (req.user.state === "deleted") {
            return resErr('This User is not Available', 404, res);
        }

        // Delete all user's Posts
        const userRelatedPosts = await Post.find({
            $and: [
                { userID: req.user._id },
                { state: "active" }
            ]
        });
        for (const post of userRelatedPosts) {
            // deleteImageFile(req, post.image);
            await Post.updateOne({ _id: post._id }, { state: "deleted" });
        }

        // Delete all user's Pets
        const userRelatedPets = await Pet.find({
            $and: [
                { userID: req.user._id },
                { state: "active" }
            ]
        });
        for (const pet of userRelatedPets) {
            // deleteImageFile(req, pet.image);
            await Pet.updateOne({ _id: pet._id }, { state: "deleted" });
        }

        // deleteImageFile(req, req.user.profilePic);

        // Delete User Account and image
        await User.updateOne({ _id: req.user._id }, { state: "deleted" });

        resMsg(`User ${req.user.name} Deleted Successfully!`, 200, res);
    } catch (err) {
        resErr(`Error Deleting User - ${err.message}`, 400, res);
    }

})

module.exports = {
    addAccount,
    addPhone,
    deletePhone,
    addProfilePic,
    getProfilePic,
    login,
    getPets,
    getPosts,
    getUser,
    deleteAccount
}