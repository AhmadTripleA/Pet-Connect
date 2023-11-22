const User = require('../Models/userModel');
const { resErr } = require('./general');

// Only checks if user exists in database by validating email
async function validateUser(req, res, next) {
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        if (user == null) {
            console.log(`ERROR: Request Body Is: ${req.body}`);
        } else {
            console.log(`inside userAuth, we found this as user: ${user}`);
        }

        if (!user) {
            resErr("This User Doesnt Exist in DB (userAuth)", 404, res);
        }

        next();

    } catch (err) {
        resErr(err.message, 400);
    }
}

module.exports.validateUser = validateUser;