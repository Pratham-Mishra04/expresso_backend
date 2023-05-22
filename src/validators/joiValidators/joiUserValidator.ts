import * as Joi from 'joi';
import { isValidNumber } from 'libphonenumber-js';
import * as fs from 'fs';
import User from '../../models/userModel';
import catchAsync from '../../managers/catchAsync';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../managers/AppError';

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
            if (!isValidNumber(value))
                return helper.message(
                    <Joi.LanguageMessages>(
                        (<unknown>'Enter a valid phone number')
                    )
                );
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
            if (!isValidNumber(value))
                return helper.message(
                    <Joi.LanguageMessages>(
                        (<unknown>'Enter a valid phone number')
                    )
                );
        }),
    passwordChangedAt: Joi.forbidden(),
    admin: Joi.forbidden(),
    active: Joi.forbidden(),
    passwordResetToken: Joi.forbidden(),
    passwordResetTokenExpiresIn: Joi.forbidden(),
});

export const joiUserCreateValidator = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await joiUserCreateSchema.validateAsync(req.body).catch((error) => {
            if (req.file) {
                const picPath = `${req.file.destination}/${req.file.filename}`;
                fs.unlinkSync(picPath);
            }
            return next(error);
        });
        if (await User.findOne({ username: req.body.username }))
            return next(
                new AppError('User with this username already exists', 400)
            );
        if (await User.findOne({ regNo: req.body.regNo }))
            return next(
                new AppError(
                    'User with this registration number already exists',
                    400
                )
            );
        if (await User.findOne({ email: req.body.email }))
            return next(new AppError('This email is already in use.', 400));
        if (await User.findOne({ phoneNo: req.body.phoneNo }))
            return next(
                new AppError('This phone number is already in use.', 400)
            );
        next();
    }
);

export const joiUserUpdateValidator = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await joiUserUpdateSchema.validateAsync(req.body).catch((error) => {
            if (req.file) {
                const picPath = `${req.file.destination}/${req.file.filename}`;
                fs.unlinkSync(picPath);
            }
            return next(error);
        });
        if (req.body.username) // add remove image if failed
            if (await User.findOne({ username: req.body.username }))
                return next(
                    new AppError('User with this username already exists', 400)
                );
        if (req.body.phoneNo)
            if (await User.findOne({ phoneNo: req.body.phoneNo }))
                return next(
                    new AppError('This phone number is already in use.', 400)
                );
        next();
    }
);
