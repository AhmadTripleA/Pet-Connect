import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: [true, "Please provide a name for your pet"],
        default: "name"
    },
    type: {
        type: String,
        required: [true, "Please select your pet's type"],
        enum: ["dog", "cat", "bird", "horse", "camel", "other"],
        default: "other"
    },
    breed: {
        type: String,
        required: [true, "Please select your pet's breed"],
        default: "breed"
    },
    gender: {
        type: String,
        required: [true, "Please select your pet's gender"],
        enum: ["m", "f"],
        default: 'm'
    },
    birthDate: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: "pet.png"
    },
    state: {
        type: String,
        enum: ["active", "deleted", "archived"],
        default: "active"
    }

}, { timestamps: true })


const Pet = mongoose.model("Pet", PetSchema)

export default Pet;