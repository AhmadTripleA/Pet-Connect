const express = require('express');
const { parseText } = require('../middlewares/general');
const chatController = require('../Controllers/chatController');

const router = express.Router();

router.post('/newChat', parseText, chatController.newChat);
router.post('/addParticipants', parseText, chatController.addParticipants);
router.post('/removeParticipants', parseText, chatController.removeParticipants);

module.exports = router;