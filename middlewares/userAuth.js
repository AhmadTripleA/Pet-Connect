import User from '../Models/user.js';
import { resErr } from './general.js';

// Only checks if user exists in database by validating email
export async function authUser(req, res, next) {
    try {
        const user = await User.findById(req.body.userID);

        if (!user) {
            return resErr("This User Doesnt Exist in DB (userAuth)", 404, res);
        }

        req.user = user;

        next();

    } catch (err) {
        return resErr(err.message, 400, res);
    }
}