import express from 'express';
import cont from '../Controllers/admin.js';
import { parseText } from '../middlewares/general.js';

const router = express.Router();

router.get('/getActiveUsers', parseText.none(), cont.getActiveUsers);
router.get('/getAllUsers', parseText.none(), cont.getAllUsers);
router.get('/getActivePosts', parseText.none(), cont.getActivePosts);
router.get('/getAllPosts', parseText.none(), cont.getAllPosts);

export default router;