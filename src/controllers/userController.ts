import User from '../models/userModel';
import AppError from '../managers/AppError';
import catchAsync from '../managers/catchAsync';
import { getAllDocs, getDoc, updateDoc } from '../utils/HandlerFactory';
import { createSendToken } from './authController';
import { NextFunction, Request, Response } from 'express';

export const getAllUsers = getAllDocs(User);

export const getUser = getDoc(User);

export const updateUser = updateDoc(User);

export const deleteUser = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    requestedAt: req.requestedAt,
    data: null,
  });
});

export const updatePassword = catchAsync(async (req:Request, res:Response, next:NextFunction) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.password)))
    return next(
      new AppError('Incorect Password, Please enter the corrent password', 401)
    );

  user.password = req.body.newPassword;
  await user.save();

  createSendToken(user, 200, res);
});