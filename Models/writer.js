const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const writerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        default: "Writer Name"
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
        required: [true, "Please provide a password"],
    }
}, { timestamps: true });

// executes this function before "save()" as a middleware
writerSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt)

    next();

})

const User = mongoose.model("Writer", writerSchema);

module.exports = User;