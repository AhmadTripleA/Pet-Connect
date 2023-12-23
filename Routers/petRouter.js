const express = require('express');
const controller = require('../Controllers/petController');
const { authUser } = require('../middlewares/userAuth');
const { uploadImg } = require('../middlewares/general');

const router = express.Router();

router.post('/addPet', uploadImg.single("file"), controller.addPet);

module.exports = router;