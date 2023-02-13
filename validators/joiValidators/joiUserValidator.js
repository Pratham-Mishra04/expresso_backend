import Joi from 'joi';
import { isValidNumber } from 'libphonenumber-js';
import fs from 'fs';
import User from '../../models/userModel.js';
import catchAsync from '../../managers/catchAsync.js';

const joiUserCreateSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-z]+$/, 'alpha')
    .required(),
  email: Joi.string()
    .email()
    .lowercase()
    .custom(async (value, helper) => {
      if (await User.findOne({ email: value })) {
        console.log('here');
        return helper.message('User with this email already exists'); // NOT WORKING
      }
    })
    .required(),
  username: Joi.string()
    .custom(async (value, helper) => {
      if (await User.findOne({ username: value }))
        return helper.message('User with this username already exists');
    })
    .required(),
  regNo: Joi.string()
    .regex(/\d{2}\w{3}\d{4}/i)
    .custom(async (value, helper) => {
      if (await User.findOne({ regNo: value }))
        return helper.message(
          'User with this Registration Number already exists'
        );
    })
    .required(),
  profilePic: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref('password'),
  phoneNo: Joi.string()
    .custom((value, helper) => {
      if (!isValidNumber(value))
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
  username: Joi.string()
    .custom(async (value, helper) => {
      if (await User.findOne({ username: value }))
        return helper.message('User with this username already exists');
    })
    .required(),
  regNo: Joi.forbidden(),
  profilePic: Joi.string(),
  password: Joi.forbidden(),
  confirmPassword: Joi.forbidden(),
  phoneNo: Joi.string()
    .custom((value, helper) => {
      if (!isValidNumber(value))
        return helper.message('Enter a valid phone number');
    })
    .required(),
  passwordChangedAt: Joi.forbidden(),
  admin: Joi.forbidden(),
  active: Joi.forbidden(),
  passwordResetToken: Joi.forbidden(),
  passwordResetTokenExpiresIn: Joi.forbidden(),
});

export const joiUserCreateValidator = catchAsync(async (req, res, next) => {
  await joiUserCreateSchema.validateAsync(req.body).catch((error) => {
    if (req.file) {
      const picPath = `${req.file.destination}/${req.file.filename}`;
      fs.unlinkSync(picPath, (err) => next(err));
    }
    console.log('here');
    return next(error);
  });
  console.log('No Error');
  next();
});

export const joiUserUpdateValidator = catchAsync(async (req, res, next) => {
  await joiUserUpdateSchema.validateAsync(req.body).catch((error) => {
    if (req.file) {
      const picPath = `${req.file.destination}/${req.file.filename}`;
      fs.unlinkSync(picPath, (err) => next(err));
    }
    return next(error);
  });
  next();
});
