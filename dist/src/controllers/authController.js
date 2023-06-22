"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = exports.createSendToken = void 0;
const jwt = require("jsonwebtoken");
const userModel_1 = require("../models/userModel");
const AppError_1 = require("../managers/AppError");
const catchAsync_1 = require("../managers/catchAsync");
const envHandler_1 = require("../managers/envHandler");
const createSendToken = (user, statusCode, res, message) => {
    const token = jwt.sign({ id: user._id }, (0, envHandler_1.default)('JWT_KEY'), {
        expiresIn: Number((0, envHandler_1.default)('JWT_TIME')) * 24 * 60,
    });
    user.password = undefined;
    const cookieSettings = {
        expires: new Date(Date.now() + Number((0, envHandler_1.default)('JWT_TIME')) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    };
    if ((0, envHandler_1.default)('NODE_ENV') === 'prod')
        cookieSettings.secure = true;
    res.cookie('token', token, cookieSettings);
    res.status(statusCode).json({
        status: 'success',
        message,
        token,
        user
    });
};
exports.createSendToken = createSendToken;
exports.signup = (0, catchAsync_1.default)(async (req, res, next) => {
    const newUser = await userModel_1.default.create(req.body);
    (0, exports.createSendToken)(newUser, 201, res, "New Account Created");
});
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new AppError_1.default("Email or Password doesn't exists", 400));
    const user = await userModel_1.default.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password)))
        throw new AppError_1.default('Incorrect Email or Password', 400);
    (0, exports.createSendToken)(user, 200, res, "Logged In");
});
exports.logout = (0, catchAsync_1.default)(async (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: 'User Loggout Out',
    });
});
//# sourceMappingURL=authController.js.map