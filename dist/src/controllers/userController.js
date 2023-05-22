"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.deleteUser = exports.updateUser = exports.getUser = exports.getAllUsers = void 0;
const userModel_1 = require("../models/userModel");
const AppError_1 = require("../managers/AppError");
const catchAsync_1 = require("../managers/catchAsync");
const HandlerFactory_1 = require("../utils/HandlerFactory");
const authController_1 = require("./authController");
exports.getAllUsers = (0, HandlerFactory_1.getAllDocs)(userModel_1.default);
exports.getUser = (0, HandlerFactory_1.getDoc)(userModel_1.default);
exports.updateUser = (0, HandlerFactory_1.updateDoc)(userModel_1.default);
exports.deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
    await userModel_1.default.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        requestedAt: req.requestedAt,
        data: null,
    });
});
exports.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findById(req.user.id).select('+password');
    if (!(await user.correctPassword(req.body.password)))
        return next(new AppError_1.default('Incorect Password, Please enter the corrent password', 401));
    user.password = req.body.newPassword;
    await user.save();
    (0, authController_1.createSendToken)(user, 200, res);
});
//# sourceMappingURL=userController.js.map