"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../logs/logger");
const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        logger_1.default.error(err.message);
        next(err);
    });
};
exports.default = catchAsync;
//# sourceMappingURL=catchAsync.js.map