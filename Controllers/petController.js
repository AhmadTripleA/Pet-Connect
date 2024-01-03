const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/userModel');
const Pet = require('../Models/petModel');
const { resErr, deleteImageFile, resMsg } = require('../middlewares/general');
const Post = require("../Models/postModel");

const addPet = asyncErrorWrapper(async (req, res, next) => {
    const { userID, name, type, breed, gender, birthDate } = req.body;

    console.log(req.body);

    const image = await req.file.filename;

    // we authenticate user here so we delete images if auth fails
    const user = await User.findById(userID)

    if (!user) {
        // deletes the image after multer has downloaded it
        deleteImageFile(req, img)

        return resErr("This User Doesn't Exist", 400, res);
    }

    const pet = new Pet({
        userID,
        name,
        type,
        breed,
        gender,
        birthDate,
        image
    });

    // save user to DB
    await pet.save();

    console.log(`New Pet "${pet.name}" Added - Owner: ${user.name}`);
    res.status(200).json({ petID: pet._id });

})

const deletePet = asyncErrorWrapper(async (req, res, next) => {

    const petID = req.body.petID;

    const pet = await Pet.findById(petID);

    if (!pet) {
        return resErr('This Pet Doesnt Exist', 404, res);
    }

    // Validate if the userID requesting this is the pet owner
    if (!(pet.userID.toString() === req.user._id.toString())) {
        return resErr('This Pet Does not Belong to You', 400, res);
    }

    const petRelatedPosts = await Post.find({ petID: petID });

    // Deletes posts where that pet was posted
    for (const post of petRelatedPosts) {
        post.state = "deleted";
        await post.save();
    }

    pet.state = "deleted";
    await pet.save();

    resMsg(`Pet (${pet.name}) Deleted From (${req.user.name}) Successfully!`, 200, res);
})

module.exports = {
    addPet,
    deletePet
}