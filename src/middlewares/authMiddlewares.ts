import * as jwt from 'jsonwebtoken';
import AppError from '../managers/AppError';
import User from '../models/userModel';
import catchAsync from '../managers/catchAsync';
import envHandler from '../managers/envHandler';
import logger from '../../logs/logger';
import { NextFunction, Request, Response } from 'express';

const jwtVerifyPromisified = (token:string, secret:string) => {
  return new Promise((resolve, reject) => {
      jwt.verify(token, secret, {}, (err, payload) => {
          if (err) {
              reject(err);
          } else {
              resolve(payload);
          }
      });
  });
}

export const protect = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  let token:string;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token)
    return next(
      new AppError('You are not Logged in. Please Login to continue', 401)
    );

  const decoded: jwt.JwtPayload = await jwtVerifyPromisified(token, envHandler('JWT_KEY'));

  const user = await User.findById(decoded.id);

  if (req.params.userID && decoded.id != req.params.userID) {
    logger.protect(
      `Non-modifying user entry attempt. \nAttempting User: ${decoded.id}\nTrying to access: ${req.user.id}\nAction: ${req.originalUrl}`
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

// export const restrictTo =
//   (...roles:[string]) =>
//   (req:Request, res:Response, next:NextFunction) => {
//     if (!roles.includes(req.user.))
//       return next(
//         new AppError(
//           'You do not have the permission to perform this action',
//           403
//         )
//       );
//     next();
//   };

export const adminOnly = (req:Request, res:Response, next:NextFunction) => {
  if (!req.user.admin)
    return next(
      new AppError('You do not have the permission to perform this action', 403)
    );
  next();
};
