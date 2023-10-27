const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-';

        // File MUST end with its original name so it has the .png or .jpeg
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports.upload = upload;