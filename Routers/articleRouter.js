const express = require('express');
const controller = require('../Controllers/articleController');
const { parseText, uploadImg } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');

const router = express.Router();

router.post('/getAll', parseText.none(), authUser, controller.getAll);
router.post('/addArticle', uploadImg.single("file"), authUser, controller.addArticle);

module.exports = router;