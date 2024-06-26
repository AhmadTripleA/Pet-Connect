const express = require('express');
const controller = require('../Controllers/pet');
const { authUser } = require('../middlewares/userAuth');
const { uploadImg, parseText } = require('../middlewares/general');

const router = express.Router();

// Adding
router.post('/add', uploadImg.single("file"), controller.addPet);
// Deleting
router.post('/delete', parseText.none(), authUser, controller.deletePet);

module.exports = router;