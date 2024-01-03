const express = require('express');
const controller = require('../Controllers/writer');
const { parseText } = require('../middlewares/general');

const router = express.Router();

router.post('/get', parseText.none(), controller.getWriter);
router.post('/add', parseText.none(), controller.addAccount);

module.exports = router;