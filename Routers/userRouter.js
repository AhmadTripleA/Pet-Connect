const express = require('express');
const userController = require('../Controllers/userController');
const {upload} = require('../config/storageConfig');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/getInfo', userController.getInfo);
router.get('/getProfilePic', userController.getProfilePic);
router.post('/setProfilePic', upload.single('profilePic'), userController.setProfilePic);

module.exports = router;