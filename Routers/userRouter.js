const express = require('express');
const controller = require('../Controllers/userController');
const { parseText } = require('../middlewares/general');
const { authUser } = require('../middlewares/userAuth');
// const { uploadImg } = require('../middlewares/general');

const router = express.Router();

router.post('/getUser', parseText.none(), authUser, controller.getUser);
router.post('/getPets', parseText.none(), authUser, controller.getPets);
router.post('/addUser', parseText.none(), controller.addAccount);
router.post('/login', parseText.none(), controller.login);

module.exports = router;