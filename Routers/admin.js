const express = require('express');
const cont = require('../Controllers/admin');
const { parseText } = require('../middlewares/general');

const router = express.Router();

router.post('/getActiveUsers', parseText.none(), cont.getActiveUsers);
router.post('/getAllUsers', parseText.none(), cont.getAllUsers);

module.exports = router;