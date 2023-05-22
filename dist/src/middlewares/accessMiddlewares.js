"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipperOrderProtect = exports.userOrderProtect = void 0;
const AppError_1 = require("../managers/AppError");
const catchAsync_1 = require("../managers/catchAsync");
const orderModel_1 = require("../models/orderModel");
exports.userOrderProtect = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = await orderModel_1.default.findById(req.params.orderID);
    if (!order)
        return next(new AppError_1.default("No Order of this ID found.", 401));
    if (String(order.placedBy) !== req.user.id)
        return next(new AppError_1.default("You dont have the permission to perform this action", 401));
    req.order = order;
    return next();
});
exports.shipperOrderProtect = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = await orderModel_1.default.findById(req.params.orderID);
    if (!order)
        return next(new AppError_1.default("No Order of this ID found.", 401));
    if (String(order.shippingDetails.shipper) !== req.user.id)
        return next(new AppError_1.default("You dont have the permission to perform this action", 401));
    req.order = order;
    return next();
});
//# sourceMappingURL=accessMiddlewares.js.map