import express from 'express';
import controller from '../Controllers/article.js';
import { authUser } from '../middlewares/userAuth.js';
import { parseText, uploadImg } from '../middlewares/general.js';

const router = express.Router();

// Adding
router.post('/add', uploadImg.single("file"), controller.add);
// Querying
router.post('/getAll', parseText.none(), authUser, controller.getAll);
router.post('/filter', parseText.none(), authUser, controller.filter);
router.get('/:id', parseText.none(), controller.getArticle);
// Deleting
router.post('/delete', parseText.none(), controller.remove);

export default router;