const asyncErrorWrapper = require("express-async-handler")
const Writer = require('../Models/writer');
const bcrypt = require('bcrypt');

const addAccount = asyncErrorWrapper(async (req, res, next) => {

    const { name, email, password } = req.body;

    const existingWriter = await Writer.findOne({ email: email });

    if (existingWriter) {
        return resErr("This Email already exists", 400, res);
    }

    const writer = new Writer({
        name,
        email,
        password
    });

    await writer.save();

    console.log(`New Writer "${writer.name}" Added - Email: ${writer.email}`);
    res.status(200).json({ writerID: writer._id });
})

const getWriter = asyncErrorWrapper(async (req, res, next) => {

    const writer = await Writer.findOne({ email: req.body.email });

    if (!writer) {
        return resErr("Writer not found", 404, res);
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(req.body.password, writer.password);

    if (!isPasswordMatch) {
        return resErr("Invalid password", 401, res);
    }

    console.log(`Writer ${writer._id} Sent Successfully!`);
    res.status(200).json({
        writerID: writer._id,
        name: writer.name,
        email: writer.email
    });
})

module.exports = {
    addAccount,
    getWriter
}