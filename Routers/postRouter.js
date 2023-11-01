const express = require('express');
const postController = require('../Controllers/postController');
// uploadImg is used to store any image(s) inside uploads/images, also parses form text. 
const { uploadImg } = require('../middlewares/imgStorage');

const router = express.Router();

router.post('/newPost', uploadImg.array('images', 10), postController.newPost);

module.exports = router;