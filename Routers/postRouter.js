const express = require('express');
const cont = require('../Controllers/postController');
const { uploadImg, parseText } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');

const router = express.Router();

router.post('/addPost', uploadImg.single("file"), authUser, cont.addPost);
router.post('/getAll', parseText.none(), authUser, cont.getAll);

module.exports = router;