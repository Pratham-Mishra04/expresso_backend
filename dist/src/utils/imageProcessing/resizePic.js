"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeUserPic = exports.resizePic = void 0;
const sharp = require("sharp");
const fs = require("fs");
const slugify_1 = require("slugify");
const logger_1 = require("../../../logs/logger");
const userModel_1 = require("../../models/userModel");
const resizePic = async (picPath, toPath, d1, d2) => {
    try {
        const buffer = await fs.promises.readFile(picPath);
        await sharp(buffer)
            .resize(d1, d2)
            .toFormat('jpeg')
            .jpeg({ quality: 100 })
            .toFile(toPath);
        await fs.promises.unlink(picPath);
    }
    catch (err) {
        logger_1.default.error(`Error in Resizing ${picPath}: ${err.message}`);
    }
};
exports.resizePic = resizePic;
const resizeUserPic = async (req, res, next) => {
    if (!req.file)
        return next();
    const picPath = `${req.file.destination}/${req.file.filename}`;
    const toPath = `public/users/${req.file.fieldname}s/${(0, slugify_1.default)(req.user ? req.user.username : req.body.username)}-${Date.now()}.jpeg`;
    (0, exports.resizePic)(picPath, toPath, 500, 500);
    req.body.profilePic = toPath.split('/')[3];
    if (req.user) {
        const user = await userModel_1.default.findById(req.user.id);
        const picPath = `public/users/${req.file.fieldname}s/${user.profilePic}`;
        if (user.profilePic !== 'default.jgp') {
            fs.unlinkSync(picPath);
        }
    }
    next();
};
exports.resizeUserPic = resizeUserPic;
//# sourceMappingURL=resizePic.js.map