import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../managers/AppError.js';
import User from '../models/userModel.js';
import catchAsync from '../managers/catchAsync.js';
import envHandler from '../managers/envHandler.js';
import logger from '../logs/logger.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token)
    return next(
      new AppError('You are not Logged in. Please Login to continue', 401)
    );

  const decoded = await promisify(jwt.verify)(token, envHandler('JWT_KEY'));
  const user = await User.findById(decoded.id);

  if (req.params.userID && decoded.id != req.params.userID) {
    logger.protect(
      `Non-modifying user entry attempt. \nAttempting User: ${decoded.id}\nTrying to access: ${req.user.userID}\nAction: ${req.originalUrl}`
    );
    return next(new AppError('Please Login in as the Modifying User.', 401));
  }
  if (!user)
    return next(new AppError('User of this token no longer exists', 401));
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('Password was recently changed. Please Login again', 401)
    );

  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    next();
  };

export const adminOnly = (req, res, next) => {
  if (!req.user.admin)
    return next(
      new AppError('You do not have the permission to perform this action', 403)
    );
  next();
};
