import catchAsync from '../managers/catchAsync';
import { Request, Response, NextFunction } from 'express';
import Order from '../models/orderModel';
import AppError from '../managers/AppError';
import * as otpGenerator from 'otp-generator';

export const getOrders = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const orders = await Order.find({ isActive: true, isAccepted: false });
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            orders,
        });
    }
);

export const acceptDelivery = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        order.isAccepted = true;
        order.shippingDetails.shipper = req.user.id;
        order.shippingDetails.deliveryAcceptedAt = new Date();
        order.status = 0;

        await order.save();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            order,
        });
    }
);

export const confirmPickUp = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        order.status = 1;

        await order.save();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            order,
        });
    }
);

export const confirmOTW = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        order.status = 2;

        await order.save();

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            order,
        });
    }
);

export const sendOTP = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);

        order.shippingDetails.OTP = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        order.shippingDetails.optExpiration = new Date(
            Date.now() + 10 * 60 * 60
        ); //10 mins

        await order.save();

        //send OTP

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            order,
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
            order,
        });
    }
);
