import * as jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/userModel';
import AppError from '../managers/AppError';
import catchAsync from '../managers/catchAsync';
import envHandler from '../managers/envHandler';
import { Response, Request, NextFunction } from 'express';

export const createSendToken = (user:UserDocument, statusCode:number, res:Response, message:string) => {
  const token = jwt.sign({ id: user._id }, envHandler('JWT_KEY'), {
    expiresIn: Number(envHandler('JWT_TIME')) * 24 * 60,
  });
  user.password = undefined;

  const cookieSettings = {
    expires: new Date(
      Date.now() + Number(envHandler('JWT_TIME')) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure:false
  };

  if (envHandler('NODE_ENV') === 'prod') cookieSettings.secure = true;

  res.cookie('token', token, cookieSettings);
  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    user
  });
};

export const signup = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res, "New Account Created");
});

export const login = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email or Password doesn't exists", 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password)))
    throw new AppError('Incorrect Email or Password', 400);
  createSendToken(user, 200, res, "Logged In");
});

export const logout = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
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
