const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/userModel');
const Pet = require('../Models/petModel');
const bcrypt = require('bcrypt'); // For hashing passwords
const { resErr, deleteImageFile } = require('../middlewares/general');

const addPet = asyncErrorWrapper(async (req, res, next) => {
    const { userID, name, type, breed, gender, birthDate } = req.body;

    const img = await req.file.filename;

    // we authenticate user here so we delete images if auth fails
    const user = await User.findById(userID);

    if (!user) {
        resErr("This User Doesn't Exist", 400, res);

        // deletes the image after multer has downloaded it
        deleteImageFile(req, img);
    }

    const pet = new Pet({
        owner: userID,
        name,
        type,
        breed,
        gender,
        birthDate,
        image: img
    });

    // save user to DB
    await pet.save();

    console.log(`New Pet "${pet.name}" Added - Owner: ${user.name}`);
    res.status(200).json({ petID: pet._id });

})

module.exports = {
    addPet
}