import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import crypto from 'crypto';
import AppError from '../managers/AppError.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    profilePic: {
      type: String,
    },
    phoneNo: Number,
    regNo: String,
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    confirmPassword: {
      type: String,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    // ACADEMIC
    admin: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password != this.confirmPassword)
    return next(new AppError('Passwords do not match', 400));
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (inPass, userPass) {
  return await bcrypt.compare(inPass, userPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestrap) {
  const changedTimestrap = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );
  return JWTTimestrap < changedTimestrap;
};

userSchema.methods.createPasswordResetToken = async function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = await bcrypt.hash(token, 4);
  this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  return token;
};

userSchema.methods.resetTokenExpired = function () {
  if (this.passwordResetTokenExpiresIn)
    return Date.now() > this.passwordResetTokenExpiresIn;
};

userSchema.methods.correctPasswordResetToken = async function (
  inToken,
  userToken
) {
  return await bcrypt.compare(inToken, userToken);
};

const User = mongoose.model('User', userSchema);

export default User;
