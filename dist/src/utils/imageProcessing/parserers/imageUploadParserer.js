"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPicUploadParserer = void 0;
const multer = require("multer");
const multerFilter_1 = require("../multerConfigs/multerFilter");
const multerDiskStorage_1 = require("../multerConfigs/multerDiskStorage");
const userPicUpload = multer({
    fileFilter: multerFilter_1.multerUserPicFilter,
    storage: multerDiskStorage_1.multerUserPicDiskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.userPicUploadParserer = userPicUpload.single('profilePic');
//# sourceMappingURL=imageUploadParserer.js.map