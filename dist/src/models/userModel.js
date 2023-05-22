"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose_1.default.Schema({
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
    regNo: {
        type: String,
        unique: true,
        required: true
    },
    profilePic: {
        type: String,
    },
    phoneNo: Number,
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
    passwordChangedAt: {
        type: Date,
        default: Date.now(),
    },
    admin: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.pre(/^find/, function (next) {
    this.find({ active: true });
    next();
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
userSchema.methods.correctPassword = async function (inPass) {
    const user = this;
    return await bcrypt.compare(inPass, user.password);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestrap) {
    const changedTimestrap = Number(this.passwordChangedAt.getTime()) / 1000;
    return JWTTimestrap < changedTimestrap;
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map