const multer = require('multer');
const path = require('path'); 
const imgPath = path.join(__dirname, '../uploads/images');

const imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgPath)
    },

    filename: function (req, file, cb) {
        // File MUST end with its original name so it has the .png or .jpeg
        const uniqueSuffix = Date.now() + '-';
        cb(null, uniqueSuffix + file.originalname)
    }
})

const uploadImg = multer({ storage: imgStorage })

module.exports.uploadImg = uploadImg;
module.exports.imgPath = imgPath;