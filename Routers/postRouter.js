const express = require('express');
const controller = require('../Controllers/postController');
const { uploadImg, parseText } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');

const router = express.Router();

router.post('/addPost', uploadImg.single("file"), authUser, controller.addPost);
router.get('/getAll', parseText.none(), authUser, controller.getAll);

module.exports = router;