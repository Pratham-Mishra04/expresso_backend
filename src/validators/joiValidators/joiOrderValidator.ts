import * as Joi from 'joi';
import catchAsync from '../../managers/catchAsync';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../managers/AppError';
import { isValidNumber } from 'libphonenumber-js';

const joiOrderCreateSchema = Joi.object({
    placedBy: Joi.string().required(),
    cart: Joi.array()
        .items(
            Joi.object({
                productName: Joi.string().required(),
                productPrice: Joi.number().required(),
            })
        )
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
        receiverPhoneNumber: Joi.number().custom((value, helper) => {
            if (!isValidNumber(value))
                return helper.message(
                    <Joi.LanguageMessages>(
                        (<unknown>'Enter a valid phone number')
                    )
                );
        }).required(),
        block: Joi.string().required(),
        roomNumber: Joi.string(),
        deliveryInstructions:Joi.string(),
        isDelivered:Joi.forbidden(),
        deliveredAt:Joi.forbidden(),
    }),
    shippingDetails: Joi.forbidden(),
    isActive: Joi.forbidden(),
    isAccepted: Joi.forbidden(),
    status: Joi.forbidden(),
    createdAt: Joi.forbidden(),
});

export const joiOrderCreateValidator = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        req.body.placedBy = req.user.id
        await joiOrderCreateSchema.validateAsync(req.body).catch((error) => {
            return next(error);
        });
        next();
    }
);
