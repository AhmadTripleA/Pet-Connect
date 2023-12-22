const User = require('../Models/userModel');
const bcrypt = require('bcrypt'); // For hashing passwords
const path = require('path'); // For working with file paths
const { imgPath, resMsg } = require('../middlewares/general');
const { resErr } = require('../middlewares/general');

exports.register = async (req, res) => {
    try {
        console.log(req.body);

        const { name, email, password, phoneNumber } = req.body;

        const existingUser = await User.findOne({ email: email });

        // check if user email already exists in database
        if (existingUser) {
            console.log("User exists already");
            return res.status(409).json(({ error: 'User Already Exists.' }));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const defaultPic = path.join(imgPath, 'default_user_icon.png');

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            profilePic: defaultPic
        });

        // add user to DB
        await user.save();

        console.log(`New User: ${name}, ${email}`);
        res.status(201).json({ message: 'User Created Successfully!' })

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message })
    }
}

exports.getInfo = async (req, res) => {
    try {

        const user = await User.findOne({
            email: req.body.email
        });

        // Return user in JSON
        res.status(200).json({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePic: user.profilePic,
        });

        console.log(`User ${user.name} Found & Delieverd!!`);

    } catch (error) {
        console.error(`Error: ${erorr.message}`)
        res.status(500).json({ error: error.message });
    }
}

exports.getProfilePic = async (req, res) => {
    try {
        // Validates user by email
        const user = await User.findOne({
            email: req.body.email
        });

        if (user && user.profilePic) {
            console.log("Image Sent!")
            res.status(200).sendFile(user.profilePic);
        } else {
            res.status(404).json({ error: 'Profile picture not found' });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.setProfilePic = async (req, res) => {

    const img = req.file;
    console.log(`file name is: ${img.filename}`);

    const user = await User.findOne({
        email: req.body.email
    });

    try {
        if (!img) {
            resErr("No file found in request", 400, res);
        }
        if (!user) {
            resErr("This User Doesn't Exist in Database", 400, res);
        }

        // Set new profile pic name
        const newImg = path.join(imgPath, img.filename);
        console.log(`new target is ${newImg}`);

        // Update User's Profile Pic
        await User.updateOne({ email: req.body.email }, { profilePic: newImg });

        console.log("Profile Pic Updated Successfully!");
        return res.status(200).json({ Message: "Profile Pic Updated Successfully!" });

    } catch (err) {
        resErr(err.message, 400, res);
        return;
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        console.log("All Users Sent Successfully!");
        return res.status(200).json(users);

    } catch (err) {
        resErr("Something went wrong :(");
    }
}

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