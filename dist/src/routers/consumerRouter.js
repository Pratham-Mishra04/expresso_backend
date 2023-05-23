"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const consumerController_1 = require("../controllers/consumerController");
const accessMiddlewares_1 = require("../middlewares/accessMiddlewares");
const joiOrderValidator_1 = require("../validators/joiValidators/joiOrderValidator");
const consumerRouter = express.Router();
consumerRouter.route('/').post(authMiddlewares_1.protect, joiOrderValidator_1.joiOrderCreateValidator, consumerController_1.createOrder);
consumerRouter
    .route('/:orderID')
    .get(authMiddlewares_1.protect, accessMiddlewares_1.userOrderProtect, consumerController_1.getOrder)
    .delete(authMiddlewares_1.protect, accessMiddlewares_1.userOrderProtect, consumerController_1.deleteOrder);
exports.default = consumerRouter;
//# sourceMappingURL=consumerRouter.js.map