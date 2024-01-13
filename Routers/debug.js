const express = require('express');
const cont = require('../Controllers/admin');
const { parseText } = require('../middlewares/general');
const Post = require('../Models/post');

const router = express.Router();

router.get('/', parseText.none(), async (req, res) => {
    const posts = await Post.find();

    if (posts) {
        res.status(200).json(posts);
    } else {
        res.status(404).json({ "error": "We can't find any post" });
    }
});


module.exports = router;