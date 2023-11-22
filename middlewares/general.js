const multer = require('multer');
const path = require('path'); 
const imgPath = path.join(__dirname, '../uploads/images');


function resMsg(Msg, code, res) {
    console.log((Msg));
    res.status(code).json({ Message: Msg });
}

function resErr(errorMsg, code, res) {
    console.log((errorMsg));
    res.status(code).json({ Error: errorMsg });
}

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

// while multer({ storage: imgStorage}) is used only in routers that store images after authentication middleware
const parseText = multer();
const uploadImg = multer({ storage: imgStorage })

module.exports = {
    parseText,
    uploadImg,
    imgPath,
    resMsg,
    resErr
};