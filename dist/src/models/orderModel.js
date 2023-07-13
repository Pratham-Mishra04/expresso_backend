"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt = require("bcryptjs");
const orderSchema = new mongoose_1.default.Schema({
    placedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    cart: [
        {
            productName: String,
            productPrice: Number,
            productQuantity: Number,
        },
    ],
    instructions: String,
    priceDetails: {
        basePrice: Number,
        discount: Number,
        deliveryCharges: Number,
        totalAmount: Number,
    },
    delivery: {
        outsideDelivery: Boolean,
        receiverName: String,
        receiverPhoneNumber: Number,
        block: String,
        roomNumber: Number,
        deliveryInstructions: String,
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: Date,
    },
    shippingDetails: {
        shipper: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
        deliveryAcceptedAt: Date,
        OTP: String,
        optExpiration: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Number,
        enum: [-1, 0, 1, 2, 3],
        default: -1,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
orderSchema.pre('save', async function (next) {
    if (this.isNew)
        return next();
    if (!this.isModified('shippingDetails.OTP'))
        return next();
    this.shippingDetails.OTP = await bcrypt.hash(this.shippingDetails.OTP, 12);
    next();
});
orderSchema.methods.isCorrectOTP = async function (inOTP) {
    const order = this;
    return await bcrypt.compare(inOTP, order.shippingDetails.OTP);
};
orderSchema.methods.isOTPExpired = function (timestamp) {
    const order = this;
    const OTPTimestamp = Number(order.shippingDetails.optExpiration.getTime()) / 1000;
    return timestamp > OTPTimestamp;
};
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
//# sourceMappingURL=orderModel.js.map