const express = require('express');
const userController = require('../Controllers/userController');
const { uploadImg } = require('../middlewares/general');
const { parseText } = require('../middlewares/general');
const { validateUser } = require('../middlewares/userAuth');

const router = express.Router();

router.post('/register', parseText.none(), userController.register);
router.get('/getInfo', parseText.none(), validateUser, userController.getInfo);
router.get('/getProfilePic', parseText.none(), userController.getProfilePic);
router.post('/setProfilePic', uploadImg.single('file'), userController.setProfilePic);
router.post('/Images', uploadImg.array('file'), userController.images);
router.get('/getAllUsers', parseText.none(), userController.getAllUsers);

module.exports = router;