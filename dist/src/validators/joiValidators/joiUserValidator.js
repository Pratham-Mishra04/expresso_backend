"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiUserUpdateValidator = exports.joiUserCreateValidator = void 0;
const Joi = require("joi");
const libphonenumber_js_1 = require("libphonenumber-js");
const fs = require("fs");
const userModel_1 = require("../../models/userModel");
const catchAsync_1 = require("../../managers/catchAsync");
const AppError_1 = require("../../managers/AppError");
const joiUserCreateSchema = Joi.object({
    name: Joi.string()
        .pattern(/^[A-Za-z ]+$/, 'alpha')
        .required(),
    email: Joi.string()
        .lowercase()
        .regex(/^[a-zA-Z]+.[a-zA-Z]+20[0,1,2][0-9]@vitstudent.ac.in/)
        .required(),
    username: Joi.string().required(),
    regNo: Joi.string()
        .regex(/\d{2}\w{3}\d{4}/i)
        .required(),
    profilePic: Joi.string(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.ref('password'),
    phoneNo: Joi.string()
        .custom((value, helper) => {
        if (!(0, libphonenumber_js_1.isValidNumber)(value))
            return helper.message('Enter a valid phone number');
    })
        .required(),
    passwordChangedAt: Joi.forbidden(),
    admin: Joi.forbidden(),
    active: Joi.forbidden(),
    passwordResetToken: Joi.forbidden(),
    passwordResetTokenExpiresIn: Joi.forbidden(),
});
const joiUserUpdateSchema = Joi.object({
    name: Joi.forbidden(),
    email: Joi.forbidden(),
    username: Joi.string(),
    regNo: Joi.forbidden(),
    profilePic: Joi.string(),
    password: Joi.forbidden(),
    confirmPassword: Joi.forbidden(),
    phoneNo: Joi.string()
        .custom((value, helper) => {
        if (!(0, libphonenumber_js_1.isValidNumber)(value))
            return helper.message('Enter a valid phone number');
    }),
    passwordChangedAt: Joi.forbidden(),
    admin: Joi.forbidden(),
    active: Joi.forbidden(),
    passwordResetToken: Joi.forbidden(),
    passwordResetTokenExpiresIn: Joi.forbidden(),
});
exports.joiUserCreateValidator = (0, catchAsync_1.default)(async (req, res, next) => {
    await joiUserCreateSchema.validateAsync(req.body).catch((error) => {
        if (req.file) {
            const picPath = `${req.file.destination}/${req.file.filename}`;
            fs.unlinkSync(picPath);
        }
        return next(error);
    });
    if (await userModel_1.default.findOne({ username: req.body.username }))
        return next(new AppError_1.default('User with this username already exists', 400));
    if (await userModel_1.default.findOne({ regNo: req.body.regNo }))
        return next(new AppError_1.default('User with this registration number already exists', 400));
    if (await userModel_1.default.findOne({ email: req.body.email }))
        return next(new AppError_1.default('This email is already in use.', 400));
    if (await userModel_1.default.findOne({ phoneNo: req.body.phoneNo }))
        return next(new AppError_1.default('This phone number is already in use.', 400));
    next();
});
exports.joiUserUpdateValidator = (0, catchAsync_1.default)(async (req, res, next) => {
    await joiUserUpdateSchema.validateAsync(req.body).catch((error) => {
        if (req.file) {
            const picPath = `${req.file.destination}/${req.file.filename}`;
            fs.unlinkSync(picPath);
        }
        return next(error);
    });
    if (req.body.username) // add remove image if failed
        if (await userModel_1.default.findOne({ username: req.body.username }))
            return next(new AppError_1.default('User with this username already exists', 400));
    if (req.body.phoneNo)
        if (await userModel_1.default.findOne({ phoneNo: req.body.phoneNo }))
            return next(new AppError_1.default('This phone number is already in use.', 400));
    next();
});
//# sourceMappingURL=joiUserValidator.js.map