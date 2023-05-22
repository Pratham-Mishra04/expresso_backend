"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const consumerController_1 = require("../controllers/consumerController");
const consumerRouter = express.Router();
// consumerRouter.route('/').post(protect, joiOrderCreateValidator, createOrder);
consumerRouter.route('/').post(consumerController_1.createOrder);
consumerRouter
    .route('/:orderID')
    .get(consumerController_1.getOrder)
    .delete(consumerController_1.deleteOrder);
// .get(protect, userOrderProtect, getOrder)
// .delete(protect, userOrderProtect, deleteOrder);
exports.default = consumerRouter;
//# sourceMappingURL=consumerRouter.js.map