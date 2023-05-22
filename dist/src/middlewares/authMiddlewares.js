"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.protect = void 0;
const jwt = require("jsonwebtoken");
const AppError_1 = require("../managers/AppError");
const userModel_1 = require("../models/userModel");
const catchAsync_1 = require("../managers/catchAsync");
const envHandler_1 = require("../managers/envHandler");
const logger_1 = require("../../logs/logger");
const jwtVerifyPromisified = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(payload);
            }
        });
    });
};
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    if (!token)
        return next(new AppError_1.default('You are not Logged in. Please Login to continue', 401));
    const decoded = await jwtVerifyPromisified(token, (0, envHandler_1.default)('JWT_KEY'));
    const user = await userModel_1.default.findById(decoded.id);
    if (req.params.userID && decoded.id != req.params.userID) {
        logger_1.default.protect(`Non-modifying user entry attempt. \nAttempting User: ${decoded.id}\nTrying to access: ${req.user.id}\nAction: ${req.originalUrl}`);
        return next(new AppError_1.default('Please Login in as the Modifying User.', 401));
    }
    if (!user)
        return next(new AppError_1.default('User of this token no longer exists', 401));
    if (user.changedPasswordAfter(decoded.iat))
        return next(new AppError_1.default('Password was recently changed. Please Login again', 401));
    req.user = user;
    next();
});
const adminOnly = (req, res, next) => {
    if (!req.user.admin)
        return next(new AppError_1.default('You do not have the permission to perform this action', 403));
    next();
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=authMiddlewares.js.map