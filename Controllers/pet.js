const asyncErrorWrapper = require("express-async-handler")
const User = require('../Models/user');
const Pet = require('../Models/pet');
const Post = require("../Models/post");
const { resErr, deleteImageFile, resMsg } = require('../middlewares/general');

const addPet = asyncErrorWrapper(async (req, res, next) => {
    try {
        const { userID, name, type, breed, gender, birthDate } = req.body;

        console.log(req.body);

        const image = await req.file.filename;

        // we authenticate user here so we delete images if auth fails
        const user = await User.findById(userID)

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
    } catch (err) {
        deleteImageFile(req, req.file.filename)
        return resErr(`Error Adding Pet - ${err}`, 400, res);
    }

})

const deletePet = asyncErrorWrapper(async (req, res, next) => {
    try {
        const petID = req.body.petID;
        const pet = await Pet.findById(petID);

        if (!pet) {
            return resErr('This Pet Doesnt Exist', 404, res);
        }

        if (pet.state === "deleted") {
            return resErr('This Pet is not Available', 404, res);
        }

        // Validate if the userID requesting this is the pet owner
        if (!(pet.userID.toString() === req.user._id.toString())) {
            return resErr('This Pet Does not Belong to You', 400, res);
        }

        // deleteImageFile(req, pet.image);

        const petRelatedPosts = await Post.find({ petID: petID });

        // Deletes posts where that pet was posted
        for (const post of petRelatedPosts) {
            // deleteImageFile(req, post.image);
            await Post.updateOne({ _id: post._id }, { state: "deleted" });
        }

        await Pet.updateOne({ _id: pet._id }, { state: "deleted" });

        resMsg(`Pet (${pet.name}) Deleted From (${req.user.name}) Successfully!`, 200, res);

    } catch (err) {
        resErr(`Error Deleting Pet - ${err.message}`, 400, res);
    }
})

module.exports = {
    addPet,
    deletePet
}