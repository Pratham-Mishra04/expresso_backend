"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUserPicFilter = void 0;
const AppError_1 = require("../../../managers/AppError");
const multerUserPicFilter = (req, file, cb) => {
    if (file.fieldname == 'profilePic') {
        if (file.mimetype.startsWith('image'))
            cb(null, true);
        else
            cb(new AppError_1.default('Only image files are allowed', 400), false);
    }
    else
        cb(new AppError_1.default('Invalid input', 400), false);
};
exports.multerUserPicFilter = multerUserPicFilter;
//# sourceMappingURL=multerFilter.js.map