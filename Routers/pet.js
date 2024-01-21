import express from 'express';
import controller from '../Controllers/pet.js';
import { authUser } from '../middlewares/userAuth.js';
import { uploadImg, parseText } from '../middlewares/general.js';

const router = express.Router();

// Adding
router.post('/add', uploadImg.single("file"), controller.addPet);
// Deleting
router.post('/delete', parseText.none(), authUser, controller.deletePet);

export default router;