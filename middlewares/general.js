const multer = require('multer');

const parseText = multer({ dest: 'uploads/' });

module.exports.parseText = parseText;