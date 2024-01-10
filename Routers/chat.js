const express = require('express');
const { parseText } = require('../middlewares/general');
const chatController = require('../Controllers/chat');

const router = express.Router();

router.post('/newChat', parseText.none(), chatController.newChat);
router.post('/addParticipants', parseText.none(), chatController.addParticipants);
router.post('/removeParticipants', parseText.none(), chatController.removeParticipants);

module.exports = router;