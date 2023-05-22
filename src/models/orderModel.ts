import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface ProductObj {
    productName: string;
    productPrice: number;
}

export interface PriceDetails {
    basePrice: number;
    discount: number;
    deliveryCharges: number;
    totalAmount: number;
}

export interface Delivery {
    receiverName: string;
    receiverPhoneNumber: number;
    block: string;
    roomNumber: number;
    deliveryInstructions: string;
    isDelivered: boolean;
    deliveredAt: Date;
}

export interface ShippingDetails {
    shipper: mongoose.Schema.Types.ObjectId;
    deliveryAcceptedAt: Date;
    OTP: string;
    optExpiration: Date;
}

export interface OrderDocument extends mongoose.Document {
    placedBy: mongoose.Schema.Types.ObjectId;
    cart: ProductObj[];
    instructions: string;
    priceDetails: PriceDetails;
    delivery: Delivery;
    shippingDetails: ShippingDetails;
    createdAt: Date;
    isActive: boolean;
    isAccepted: boolean;
    status: number;
    isCorrectOTP(inOTP: string): Promise<boolean>;
    isOTPExpired(timestrap:number):boolean
}

const orderSchema = new mongoose.Schema(
    {
        placedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        cart: [
            {
                productName: String,
                productPrice: Number,
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
                type: mongoose.Schema.Types.ObjectId,
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
            enum: [-1, 0, 1, 2, 3], // -1:notAccepted,  0:accepted, 1: pickedUp, 2:on the way, 3:delivered
            default: -1,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

orderSchema.pre('save', async function (next) {
    if(this.isNew) return next()
    if (!this.isModified('shippingDetails.OTP')) return next();
    this.shippingDetails.OTP = await bcrypt.hash(this.shippingDetails.OTP, 12);
    next();
});

orderSchema.methods.isCorrectOTP = async function (
    inOTP: string
): Promise<boolean> {
    const order = this as OrderDocument;
    return await bcrypt.compare(inOTP, order.shippingDetails.OTP);
};

orderSchema.methods.isOTPExpired = function (timestrap: number): boolean {
    const order = this as OrderDocument;
    const OTPTimestrap: number =
        Number(order.shippingDetails.optExpiration.getTime()) / 1000;
    return timestrap > OTPTimestrap;
};

const Order = mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;
