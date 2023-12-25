const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/userModel');
const Pet = require('../Models/petModel');
const bcrypt = require('bcrypt'); // For hashing passwords
const { resErr } = require('../middlewares/general');

const addAccount = asyncErrorWrapper(async (req, res, next) => {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });

    // check if user email already exists in database
    if (existingUser) {
        resErr("This Email already exists", 400, res);
    }

    const defaultPic = 'default_user_icon.png';

    const user = new User({
        name,
        email,
        password,
        profilePic: defaultPic
    });

    // save user to DB
    await user.save();

    console.log(`New User "${user.name}" Added - Email: ${user.email}`);
    res.status(200).json({ userID: user._id });
})

const login = asyncErrorWrapper(async (req, res, next) => {

    // Find the user in the database based on the email
    const user = await User.findOne({ email: req.body.email });

    // Check if the user exists
    if (!user) {
        return resErr("User not found", 404, res);
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

    const id = req.body.userID;

    const user = await User.findById(id)

    const data = {
        userID: user._id,
        name: user.name,
        profilePic: user.profilePic,
        email: user.email,
        role: user.role,
        petID: await Pet.find({ userID: user._id })
    }

    console.log(data)

    res.status(200).json(data);
})

const getPets = asyncErrorWrapper(async (req, res, next) => {

    const user = req.body.userID;

    console.log(user)

    const pets = await Pet.find({ userID: user });

    return res.status(200).json(pets);
})

// exports.getProfilePic = async (req, res) => {
//     try {
//         // Validates user by email
//         const user = await User.findOne({
//             email: req.body.email
//         });

//         if (user && user.profilePic) {
//             console.log("Image Sent!")
//             res.status(200).sendFile(user.profilePic);
//         } else {
//             res.status(404).json({ error: 'Profile picture not found' });
//         }

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };
// exports.setProfilePic = async (req, res) => {

//     const img = req.file;
//     console.log(`file name is: ${img.filename}`);

//     const user = await User.findOne({
//         email: req.body.email
//     });

//     try {
//         if (!img) {
//             resErr("No file found in request", 400, res);
//         }
//         if (!user) {
//             resErr("This User Doesn't Exist in Database", 400, res);
//         }

//         // Set new profile pic name
//         const newImg = path.join(imgPath, img.filename);
//         console.log(`new target is ${newImg}`);

//         // Update User's Profile Pic
//         await User.updateOne({ email: req.body.email }, { profilePic: newImg });

//         console.log("Profile Pic Updated Successfully!");
//         return res.status(200).json({ Message: "Profile Pic Updated Successfully!" });

//     } catch (err) {
//         resErr(err.message, 400, res);
//         return;
//     }
// }
// exports.images = async (req, res) => {

//     const img = req.files;

//     try {
//         if (!img) {
//             resErr("No files found in request", 400, res);
//         }
//         resMsg("All Images added succesfully", 200, res);

//     } catch (err) {
//         return resErr(err.message, 400, res);
//     }
// }

module.exports = {
    addAccount,
    login,
    getPets,
    getUser
}