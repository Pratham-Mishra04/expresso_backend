"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joiOrderCreateValidator = void 0;
const Joi = require("joi");
const catchAsync_1 = require("../../managers/catchAsync");
const libphonenumber_js_1 = require("libphonenumber-js");
const joiOrderCreateSchema = Joi.object({
    placedBy: Joi.string().required(),
    cart: Joi.array()
        .items(Joi.object({
        productName: Joi.string().required(),
        productPrice: Joi.number().required(),
    }))
        .required(),
    instructions: Joi.string(),
    priceDetails: Joi.object({
        basePrice: Joi.number().required(),
        discount: Joi.number().required(),
        deliveryCharges: Joi.number().required(),
        totalAmount: Joi.number().required(),
    }),
    delivery: Joi.object({
        receiverName: Joi.string().required(),
        receiverPhoneNumber: Joi.string().custom((value, helper) => {
            if (!(0, libphonenumber_js_1.isValidNumber)(value))
                return helper.message('Enter a valid phone number');
        }).required(),
        block: Joi.string().required(),
        roomNumber: Joi.string(),
        deliveryInstructions: Joi.string(),
        isDelivered: Joi.forbidden(),
        deliveredAt: Joi.forbidden(),
    }),
    shippingDetails: Joi.forbidden(),
    isActive: Joi.forbidden(),
    isAccepted: Joi.forbidden(),
    status: Joi.forbidden(),
    createdAt: Joi.forbidden(),
});
exports.joiOrderCreateValidator = (0, catchAsync_1.default)(async (req, res, next) => {
    req.body.placedBy = req.user.id;
    await joiOrderCreateSchema.validateAsync(req.body).catch((error) => {
        return next(error);
    });
    next();
});
//# sourceMappingURL=joiOrderValidator.js.map