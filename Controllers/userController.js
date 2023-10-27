const User = require('../Models/userModel');
const bcrypt = require('bcrypt'); // For hashing passwords
const path = require('path'); // For working with file paths
const imagesAddress = path.join(__dirname, '../public/images');

exports.register = async (req, res) => {
    try {
        console.log(req.body);

        const { name, email, password, phoneNumber } = req.body;

        const existingUser = await User.findOne({ email: email });

        // check if user email already exists in database
        if (existingUser) {
            console.log("User exists already");
            res.status(409).json(({ error: 'User Already Exists.' }));
            return;
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const defaultPic = path.join(imagesAddress, 'default_user_icon.png');

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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        // if this email doesn't exist in DB...
        if (!user) {
            console.log("User Doesn't Exist");

            res.status(401).json({ error: 'User Doesnt Exist' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        // return user as JSON
        if (passwordMatch) {
            res.status(200).json(user);
            console.log('User Returned to Sender');
        } else {
            res.status(400).json({ error: 'Incorrect Password' });
            console.log('Incorrect Password');
        }

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

        if (!user) {
            console.log("User Not Found, Can't Get Info")
            return res.status(404).json({ error: 'User not found' });
        }

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

        // if user doesn't exist
        if (!user) {
            console.log("User Not Found, Can't Get Info")
            return res.status(404).json({ error: 'User not found' });
        }

        if (user && user.profilePic) {
            console.log("Image Sent!")
            res.status(200).sendFile(user.profilePic);
        } else {
            res.status(404).json({ error: 'Profile picture not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setProfilePic = async (req, res) => {

    console.log(req.body);

    console.log(`Path is: ${imagesAddress}`);

    console.log(`file name is: ${req.file.filename}`);
    try {
        if (!req.file) {
            console.log('No file found in request');
            return res.status(404).json({ error: "No file found in request" });
        }

        // Set new profile pic name
        const newProfileImage = path.join(imagesAddress, req.file.filename);
        console.log(`new target is ${newProfileImage}`);

        // Check if email exists
        const user = await User.updateOne({ email: req.body.email }, { profilePic: newProfileImage });

        // Checks if user document has changed in the Database
        if (user.nModified === 0) {
            console.log('No document was modified. User not found.');
        } else {
            console.log('Document Found; User Updated');
        }

        if (!user) {
            console.log('This User Doesnt Exist in DB');
            return res.status(404).json({ Error: 'This Email Doesnt Exist in DB' });
        }

        console.log("Profile Pic Updated Successfully!");
        return res.status(200).json({ Message: "Profile Pic Updated Successfully!" });

    } catch (err) {
        console.error(err.message);
        return res.status(400).json({ Error: err.message });
    }
}