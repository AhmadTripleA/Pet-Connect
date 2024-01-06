const express = require('express');
const cont = require('../Controllers/admin');
const { parseText } = require('../middlewares/general');

const router = express.Router();

router.post('/getActiveUsers', parseText.none(), cont.getActiveUsers);
router.post('/getAllUsers', parseText.none(), cont.getAllUsers);
router.post('/getActivePosts', parseText.none(), cont.getActivePosts);
router.post('/getAllPosts', parseText.none(), cont.getAllPosts);

module.exports = router;