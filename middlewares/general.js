import multer from 'multer';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const imgPath = path.join(__dirname, '../uploads/images');

export function resMsg(Msg, code, res) {
    console.log((Msg));
    res.status(code).json({ Message: Msg });
}

export function resErr(errorMsg, code, res) {
    console.log((errorMsg));
    res.status(code).json({ Error: errorMsg });
}

export const imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgPath)
    },

    filename: function (req, file, cb) {
        // File MUST end with its original name so it has the .png or .jpeg
        const uniqueSuffix = Date.now() + '-';
        cb(null, uniqueSuffix + file.originalname)
    }
})

export const deleteImageFile = (req, imageName) => {

    const filePath = path.join(imgPath, imageName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file "${imageName}" - ${err}`);
        } else {
            console.log(`File Deleted Successfully:"${imageName}"`);
        }
    });
}

// while multer({ storage: imgStorage}) is used only in routers that store images after authentication middleware
export const parseText = multer();
export const uploadImg = multer({ storage: imgStorage })