"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = exports.confirmOTW = exports.confirmPickUp = exports.acceptDelivery = exports.getOrders = void 0;
const catchAsync_1 = require("../managers/catchAsync");
const orderModel_1 = require("../models/orderModel");
const AppError_1 = require("../managers/AppError");
const otpGenerator = require("otp-generator");
const envHandler_1 = require("../managers/envHandler");
exports.getOrders = (0, catchAsync_1.default)(async (req, res, next) => {
    const orders = await orderModel_1.default.find({ isActive: true, isAccepted: false });
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: "Orders Fetched",
        noOfOrders: orders.length,
        orders,
    });
});
exports.acceptDelivery = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = await orderModel_1.default.findById(req.params.orderID);
    if (order.isAccepted)
        return next(new AppError_1.default('Order is already being Delivered', 400));
    if (order.status >= 0)
        return next(new AppError_1.default('Cannot perform this action', 400));
    order.isAccepted = true;
    order.shippingDetails.shipper = req.user.id;
    order.shippingDetails.deliveryAcceptedAt = new Date();
    order.status = 0;
    await order.save();
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: "Order Delivery Accepted",
    });
});
exports.confirmPickUp = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = await orderModel_1.default.findById(req.params.orderID);
    if (order.status >= 1)
        return next(new AppError_1.default('Cannot perform this action', 400));
    order.status = 1;
    await order.save();
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: "Order Picked Up",
    });
});
exports.confirmOTW = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = await orderModel_1.default.findById(req.params.orderID);
    if (order.status >= 2)
        return next(new AppError_1.default('Cannot perform this action', 400));
    order.status = 2;
    await order.save();
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: "Order OTW",
    });
});
exports.sendOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = await orderModel_1.default.findById(req.params.orderID);
    const OTP = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    order.shippingDetails.OTP = OTP;
    order.shippingDetails.optExpiration = new Date(Date.now() + Number((0, envHandler_1.default)('OTP_EXPIRATION')) * 60 * 60); //10 mins
    await order.save();
    console.log(OTP); //send OTP
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: "OTP Sent",
    });
});
exports.verifyOTP = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = await orderModel_1.default.findById(req.params.orderID);
    if (order.isOTPExpired(Date.now()))
        return next(new AppError_1.default('OTP has Expired, please generate a new one', 400));
    if (!order.isCorrectOTP(req.body.OTP))
        return next(new AppError_1.default('Incorrect OTP', 400));
    order.status = 3;
    order.isActive = false;
    order.delivery.deliveredAt = new Date();
    await order.save();
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message: "OTP Verified",
    });
});
//# sourceMappingURL=shipperController.js.map