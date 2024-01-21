import express from 'express';
import { parseText } from '../middlewares/general.js';
import chatController from '../Controllers/chat.js';

const router = express.Router();

router.post('/newChat', parseText.none(), chatController.newChat);
router.post('/addParticipants', parseText.none(), chatController.addParticipants);
router.post('/removeParticipants', parseText.none(), chatController.removeParticipants);

export default router;