const express = require('express');
const cont = require('../Controllers/admin');
const { parseText } = require('../middlewares/general');

const router = express.Router();

router.get('/getActiveUsers', parseText.none(), cont.getActiveUsers);
router.get('/getAllUsers', parseText.none(), cont.getAllUsers);
router.get('/getActivePosts', parseText.none(), cont.getActivePosts);
router.get('/getAllPosts', parseText.none(), cont.getAllPosts);

module.exports = router;