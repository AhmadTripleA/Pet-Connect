const express = require('express');
const userController = require('../Controllers/userController');
// uploadImg is used to store any image(s) inside uploads/images, also parses form text. 
const { uploadImg } = require('../middlewares/imgStorage');
// parseText is only used for parsing form text (no images allowed).
const { parseText } = require ('../middlewares/general');

const router = express.Router();

router.post('/register', parseText.none(), userController.register);
router.post('/login', parseText.none(), userController.login);
router.get('/getInfo', parseText.none(), userController.getInfo);
router.get('/getPosts', parseText.none(), userController.getPosts);
router.get('/getProfilePic', parseText.none(), userController.getProfilePic);
router.post('/setProfilePic', uploadImg.single('profilePic'), userController.setProfilePic);

module.exports = router;