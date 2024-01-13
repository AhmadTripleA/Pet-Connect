const express = require('express');
const cont = require('../Controllers/user');
const { parseText, uploadImg } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');
// const { uploadImg } = require('../middlewares/general');

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

module.exports = router;