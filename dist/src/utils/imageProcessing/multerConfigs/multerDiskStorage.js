"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUserPicDiskStorage = void 0;
const path = require("path");
const multer = require("multer");
exports.multerUserPicDiskStorage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, `./public/users/${file.fieldname}s`);
    },
    filename(req, file, callback) {
        const name = `${req.user ? req.user.username : req.body.username}-${Date.now()}${path.extname(file.originalname)}`;
        req.body[`${file.fieldname}`] = name;
        callback(null, name);
    },
});
//# sourceMappingURL=multerDiskStorage.js.map