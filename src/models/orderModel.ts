import { boolean } from 'joi';
import mongoose from 'mongoose';

export interface ProductObj{
    productName:string;
    productPrice:number;
}

export interface PriceDetails{
    basePrice:number;
    discount:number;
    deliveryCharges:number;
    totalAmount:number
}

export interface Delivery{
    receiverName:string;
    receiverPhoneNumber:number;
    block:string;
    roomNumber:number;
    deliveryInstructions:string;
    isDelivered:boolean
}

export interface OrderDocument extends mongoose.Document {
    placedBy:mongoose.Schema.Types.ObjectId;
    cart:ProductObj[];
    instructions:string;
    priceDetails:PriceDetails;
    delivery:Delivery
    createdAt: Date;
    isActive:boolean;
}

const orderSchema = new mongoose.Schema(
    {
        placedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        cart:[
            {
                productName:String,
                productPrice:Number
            }
        ],
        instructions:String,
        priceDetails:{
            basePrice:Number,
            discount:Number,
            deliveryCharges:Number,
            totalAmount:Number
        },
        delivery:{
            receiverName:String,
            receiverPhoneNumber:Number,
            block:String,
            roomNumber:Number,
            deliveryInstructions:String,
            isDelivered:{
                type:Boolean,
                default:false
            },
        },
        isActive:{
            type:Boolean,
            default:true
        },
        createdAt:{
            type:Date,
            default:Date.now()
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Order = mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;
