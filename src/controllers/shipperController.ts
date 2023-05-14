import catchAsync from '../managers/catchAsync';
import { Request, Response, NextFunction } from 'express';
import Order from '../models/orderModel';

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
