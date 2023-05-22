"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const accessMiddlewares_1 = require("../middlewares/accessMiddlewares");
const shipperController_1 = require("../controllers/shipperController");
const shipperRouter = express.Router();
// shipperRouter.route('/').get(protect, getOrders);
shipperRouter.route('/').get(shipperController_1.getOrders);
// shipperRouter.get('/accept/:orderID', protect, acceptDelivery);
shipperRouter.get('/accept/:orderID', shipperController_1.acceptDelivery);
shipperRouter.get('/pickUp/:orderID', 
// protect,
accessMiddlewares_1.shipperOrderProtect, shipperController_1.confirmPickUp);
// shipperRouter.get('/otw/:orderID', protect, shipperOrderProtect, confirmOTW);
shipperRouter.get('/otw/:orderID', shipperController_1.confirmOTW);
shipperRouter
    .route('/otp/:orderID')
    .get(shipperController_1.sendOTP)
    .post(shipperController_1.verifyOTP);
// .get(protect, shipperOrderProtect, sendOTP)
// .post(protect, shipperOrderProtect, verifyOTP);
exports.default = shipperRouter;
//# sourceMappingURL=shipperRouter.js.map