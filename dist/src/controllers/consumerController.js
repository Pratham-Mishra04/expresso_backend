"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.getOrder = exports.createOrder = void 0;
const catchAsync_1 = require("../managers/catchAsync");
const orderModel_1 = require("../models/orderModel");
exports.createOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    req.body.placedBy = req.user.id;
    const order = await orderModel_1.default.create(req.body);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        order,
    });
});
exports.getOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    const order = req.order;
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        order,
    });
});
exports.deleteOrder = (0, catchAsync_1.default)(async (req, res, next) => {
    await orderModel_1.default.findByIdAndDelete(req.order.id);
    res.status(204).json({
        status: 'success',
        requestedAt: req.requestedAt,
    });
});
//# sourceMappingURL=consumerController.js.map