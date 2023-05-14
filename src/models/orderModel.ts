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
    deliveredAt:Date;
}

export interface ShippingDetails{
    shipper:mongoose.Schema.Types.ObjectId;
    deliveryAcceptedAt:Date;
    opt:string;
    optExpiration:Date
}

export interface OrderDocument extends mongoose.Document {
    placedBy:mongoose.Schema.Types.ObjectId;
    cart:ProductObj[];
    instructions:string;
    priceDetails:PriceDetails;
    delivery:Delivery
    shippingDetails:ShippingDetails;
    createdAt: Date;
    isActive:boolean;
    isAccepted:boolean;
    status:number
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
            deliveredAt:Date
        },
        shippingDetails:{
            shipper:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            deliveryAcceptedAt:Date,
            opt:String,
            optExpiration:Date
        },
        isActive:{
            type:Boolean,
            default:true
        },
        isAccepted:{
            type:Boolean,
            default:false
        },
        status:{
            type:Number,
            enum:[-1,0,1,2,3],  // -1:notAccepted,  0: accepted, 1: pickedUp, 2:on the way, 3:delivered
            default:-1
        },
        createdAt:{
            type:Date,
            default:Date.now()
        },
        
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Order = mongoose.model<OrderDocument>('Order', orderSchema);

export default Order;
