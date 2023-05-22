import * as path from 'path';
import * as multer from 'multer';

export const multerUserPicDiskStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, `./public/users/${file.fieldname}s`);
    },
    filename(req, file, callback) {
        const name = `${
            req.user ? req.user.username : req.body.username
        }-${Date.now()}${path.extname(file.originalname)}`;
        req.body[`${file.fieldname}`] = name;
        callback(null, name);
    },
});
