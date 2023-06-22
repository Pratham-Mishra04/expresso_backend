import catchAsync from '../managers/catchAsync';
import { Request, Response, NextFunction } from 'express';
import Order from '../models/orderModel';
import AppError from '../managers/AppError';
import * as otpGenerator from 'otp-generator';
import envHandler from '../managers/envHandler';

export const getOrders = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const orders = await Order.find({ isActive: true, isAccepted: false });
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Orders Fetched",
            noOfOrders: orders.length,
            orders,
        });
    }
);

export const acceptDelivery = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        if (order.isAccepted)
            return next(new AppError('Order is already being Delivered', 400));

        if(order.status>=0) return next(new AppError('Cannot perform this action', 400));

        order.isAccepted = true;
        order.shippingDetails.shipper = req.user.id;
        order.shippingDetails.deliveryAcceptedAt = new Date();
        order.status = 0;

        await order.save();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Order Delivery Accepted",
        });
    }
);

export const confirmPickUp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        if(order.status>=1) return next(new AppError('Cannot perform this action', 400));

        order.status = 1;

        await order.save();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Order Picked Up",
        });
    }
);

export const confirmOTW = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        if(order.status>=2) return next(new AppError('Cannot perform this action', 400));

        order.status = 2;

        await order.save();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Order OTW",
        });
    }
);

export const sendOTP = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        const OTP = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        order.shippingDetails.OTP = OTP;
        order.shippingDetails.optExpiration = new Date(
            Date.now() + Number(envHandler('OTP_EXPIRATION')) * 60 * 60
        ); //10 mins

        await order.save();

        console.log(OTP); //send OTP

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"OTP Sent",
        });
    }
);

export const verifyOTP = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        if (order.isOTPExpired(Date.now()))
            return next(
                new AppError('OTP has Expired, please generate a new one', 400)
            );
        if (!order.isCorrectOTP(req.body.OTP))
            return next(new AppError('Incorrect OTP', 400));

        order.status = 3;
        order.isActive = false;
        order.delivery.deliveredAt = new Date();

        await order.save();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"OTP Verified",
        });
    }
);
