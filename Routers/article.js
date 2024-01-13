const express = require('express');
const controller = require('../Controllers/article');
const { parseText, uploadImg } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');

const router = express.Router();

// Adding
router.post('/add', uploadImg.single("file"), controller.add);
// Querying
router.post('/getAll', parseText.none(), authUser, controller.getAll);
router.post('/filter', parseText.none(), authUser, controller.filter);
// Deleting
router.post('/delete', parseText.none(), controller.remove);

module.exports = router;