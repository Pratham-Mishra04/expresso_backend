import catchAsync from "../managers/catchAsync";
import { Request, Response, NextFunction } from "express";
import Order from "../models/orderModel";

export const createOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        req.body.placedBy=req.user.id;
        const order = await Order.create(req.body);
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"New Order Created",
            order,
        });
    }
)

export const getOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order=req.order;
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Order Fetched",
            order,
        });
    }
)

export const deleteOrder = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await Order.findByIdAndDelete(req.order.id)
        res.status(204).json({
            status: 'success',
            message:"Order Deleted",
            requestedAt: req.requestedAt,
        });
    }
)