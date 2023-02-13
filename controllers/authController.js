import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../managers/AppError.js';
import catchAsync from '../managers/catchAsync.js';
import envHandler from '../managers/envHandler.js';

export const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, envHandler('JWT_KEY'), {
    expiresIn: envHandler('JWT_TIME') * 24 * 60,
  });
  user.password = undefined;

  const cookieSettings = {
    expires: new Date(
      Date.now() + envHandler('JWT_TIME') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (envHandler('NODE_ENV') === 'prod') cookieSettings.secure = true;

  res.cookie('token', token, cookieSettings);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Email or Password doesn't exists", 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    throw new AppError('Incorrect Email or Password', 400);
  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
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
