const express = require('express');
const cont = require('../Controllers/post');
const { uploadImg, parseText } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');

const router = express.Router();

router.post('/addPost', uploadImg.single("file"), authUser, cont.addPost);
router.post('/getAll', parseText.none(), authUser, cont.getAll);
router.post('/getByTag', parseText.none(), authUser, cont.getByTag);
router.post('/delete', parseText.none(), authUser, cont.deletePost);

module.exports = router;