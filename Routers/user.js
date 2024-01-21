import express from 'express';
import cont from '../Controllers/user.js';
import { parseText, uploadImg } from '../middlewares/general.js';
import { authUser } from '../middlewares/userAuth.js';

const router = express.Router();

// Adding
router.post('/addUser', parseText.none(), cont.addAccount);
router.post('/addPhone', parseText.none(), authUser, cont.addPhone);
router.post('/addProfilePic', uploadImg.single('file'), authUser, cont.addProfilePic)
// Querying
router.post('/login', parseText.none(), cont.login);
router.post('/getPosts', parseText.none(), authUser, cont.getPosts);
router.post('/getUser', parseText.none(), authUser, cont.getUser);
router.post('/getPets', parseText.none(), authUser, cont.getPets);
router.post('/getProfilePic', parseText.none(), authUser, cont.getProfilePic);
// Deleting
router.post('/deletePhone', parseText.none(), authUser, cont.deletePhone);
router.post('/delete', parseText.none(), authUser, cont.deleteAccount);

export default router;