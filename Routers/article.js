const express = require('express');
const controller = require('../Controllers/article');
const { parseText, uploadImg } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');

const router = express.Router();

router.post('/getAll', parseText.none(), authUser, controller.getAll);
router.post('/add', uploadImg.single("file"), controller.add);
router.post('/delete', parseText.none(), controller.remove);
router.post('/filter', parseText.none(), authUser, controller.filter);

module.exports = router;