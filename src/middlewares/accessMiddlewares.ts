import AppError from "../managers/AppError";
import catchAsync from "../managers/catchAsync";
import Order from "../models/orderModel";
import { Request, Response, NextFunction } from "express";

export const userOrderProtect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);
        if(!order) return next(new AppError("No Order of this ID found.", 401))
        if(String(order.placedBy)!==req.user.id) return next(new AppError("You dont have the permission to perform this action", 401))
        req.order=order;
        return next()
    }
)

export const shipperOrderProtect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const order = await Order.findById(req.params.orderID);
        if(!order) return next(new AppError("No Order of this ID found.", 401))
        if(String(order.shippingDetails.shipper)!==req.user.id) return next(new AppError("You dont have the permission to perform this action", 401))
        req.order=order;
        return next()
    }
)