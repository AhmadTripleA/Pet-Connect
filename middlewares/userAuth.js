const User = require('../Models/userModel');
const { resErr } = require('./general');

// Only checks if user exists in database by validating email
async function authUser(req, res, next) {
    try {
        const user = await User.findById(req.body.userID);

        if (!user) {
            resErr("This User Doesnt Exist in DB (userAuth)", 404, res);
        }

        next();

    } catch (err) {
        resErr(err.message, 400);
    }
}

module.exports.authUser = authUser;