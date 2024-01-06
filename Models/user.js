const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    profilePic: {
        type: String,
        default: "default_user_icon.png"
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        minlength: [4, "Please provide a password with min length : 4 "],
        required: [true, "Please provide a password"]
    },
    role: {
        type: String,
        enum: ["user", "admin", "writer"],
        default: "user"
    },
    phone: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        enum: ["active", "deleted", "archived", "banned"],
        default: "active"
    }
}, { timestamps: true });

// executes this function before "save()" as a middleware
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt)

    next();

})

const User = mongoose.model("User", userSchema);

module.exports = User;