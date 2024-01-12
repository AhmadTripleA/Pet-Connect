const express = require('express');
const cont = require('../Controllers/post');
const { uploadImg, parseText } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');

const router = express.Router();

// Adding 
router.post('/addPost', uploadImg.single("file"), authUser, cont.addPost);
router.post('/addComment', parseText.none(), authUser, cont.addComment);
router.post('/like', parseText.none(), authUser, cont.likePost);
// Querying
router.post('/getAll', parseText.none(), authUser, cont.getAll);
router.post('/getByTag', parseText.none(), authUser, cont.getByTag);
router.post('/getRecentPostsByTag', parseText.none(), cont.getRecentPostsByTag);
router.post('/getComments', parseText.none(), authUser, cont.getComments);
router.post('/filterPosts', parseText.none(), authUser, cont.filterPosts);
// Deleting
router.post('/deleteComment', parseText.none(), authUser, cont.deleteComment);
router.post('/delete', parseText.none(), authUser, cont.deletePost);

router.get('/', parseText.none(), cont.getPosts)

module.exports = router;