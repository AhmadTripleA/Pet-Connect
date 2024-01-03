const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/userModel');
const Pet = require('../Models/petModel');
const Post = require('../Models/postModel');
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
    const user = await User.findById(req.body.userID)
    const img = req.file.filename;
    if (!img) {
        deleteImageFile(req, img);
        return resErr("No file found in request", 400, res);
    }

    await User.updateOne({ _id: user._id }, { profilePic: img });

    resMsg("Profile Pic Updated Successfully!", 200, res);
})

const addPhone = asyncErrorWrapper(async (req, res, next) => {
    const phone = req.body.phone;
    req.user.phone = phone;

    await req.user.save();

    resMsg(`Phone Number ${phone} added to ${req.user.name}!`, 200, res);
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
        email: user.email
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
    }

    res.status(200).json(data);
})

const getPets = asyncErrorWrapper(async (req, res, next) => {
    const pets = await Pet.find({
        $and: [
            { userID: req.user._id },
            { state: "active" }
        ]
    });
    return res.status(200).json(pets);
})

const getPosts = asyncErrorWrapper(async (req, res, next) => {
    const posts = await Post.find({
        $and: [
            { userID: req.user._id },
            { state: "active" }
        ]
    });
    return res.status(200).json(posts);
})

const deleteAccount = asyncErrorWrapper(async (req, res, next) => {
    // Delete all user's Posts
    const userRelatedPosts = await Post.find({
        $and: [
            { userID: req.user._id },
            { state: "active" }
        ]
    });
    for (const post of userRelatedPosts){
        post.state = "deleted";
        await post.save();
    }

    // Delete all user's Pets
    const userRelatedPets = await Pet.find({
        $and: [
            { userID: req.user._id },
            { state: "active" }
        ]
    });
    for (const pet of userRelatedPets){
        pet.state = "deleted";
        await pet.save();
    }

    // Delete User Account
    req.user.state = "deleted";
    await req.user.save();
    resMsg(`User ${req.user.name} Deleted Successfully!`, 200, res);
})

module.exports = {
    addAccount,
    addPhone,
    addProfilePic,
    login,
    getPets,
    getPosts,
    getUser,
    deleteAccount
}