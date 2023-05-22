"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const accessMiddlewares_1 = require("../middlewares/accessMiddlewares");
const shipperController_1 = require("../controllers/shipperController");
const shipperRouter = express.Router();
shipperRouter.route('/').get(authMiddlewares_1.protect, shipperController_1.getOrders);
shipperRouter.get('/accept/:orderID', authMiddlewares_1.protect, shipperController_1.acceptDelivery);
shipperRouter.get('/pickUp/:orderID', authMiddlewares_1.protect, accessMiddlewares_1.shipperOrderProtect, shipperController_1.confirmPickUp);
shipperRouter.get('/otw/:orderID', authMiddlewares_1.protect, accessMiddlewares_1.shipperOrderProtect, shipperController_1.confirmOTW);
shipperRouter
    .route('/otp/:orderID')
    .get(authMiddlewares_1.protect, accessMiddlewares_1.shipperOrderProtect, shipperController_1.sendOTP)
    .post(authMiddlewares_1.protect, accessMiddlewares_1.shipperOrderProtect, shipperController_1.verifyOTP);
exports.default = shipperRouter;
//# sourceMappingURL=shipperRouter.js.map