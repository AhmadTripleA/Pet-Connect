import express from 'express';
import controller from '../Controllers/writer.js';
import { parseText } from '../middlewares/general.js';

const router = express.Router();

router.post('/get', parseText.none(), controller.getWriter);
router.post('/add', parseText.none(), controller.addAccount);

export default router;