const express = require('express');
const controller = require('../Controllers/petController');
const { authUser } = require('../middlewares/userAuth');
const { uploadImg, parseText } = require('../middlewares/general');

const router = express.Router();

router.post('/add', uploadImg.single("file"), controller.addPet);
router.post('/delete', parseText.none(), authUser, controller.deletePet);

module.exports = router;