const mongoose = require("mongoose")

const PetSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: [true, "Please provide a name for your pet"]
    },
    type: {
        type: String,
        required: [true, "Please select your pet's type"],
        enum: ["dog", "cat", "bird", "horse", "camel", "other"]
    },
    breed: {
        type: String,
        required: [true, "Please select your pet's breed"]
    },
    gender: {
        type: String,
        required: [true, "Please select your pet's gender"],
        enum: ["m", "f"]
    },
    birthDate: {
        type: Date
    },
    image: {
        type: String,
        default: "pet.png"
    }

}, { timestamps: true })


const Pet = mongoose.model("Pet", PetSchema)

module.exports = Pet;