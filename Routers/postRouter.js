const express = require('express');
const postController = require('../Controllers/postController');
const { uploadImg } = require('../middlewares/general');
const { parseText } = require('../middlewares/general');
const { validateUser } = require('../middlewares/userAuth');

const router = express.Router();

router.post('/newPost', validateUser, uploadImg.array('images', 10), postController.newPost);
router.get('/getPosts', validateUser, parseText.none(), postController.getPosts);

module.exports = router;