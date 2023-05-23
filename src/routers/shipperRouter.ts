import * as express from 'express';
import { protect } from '../middlewares/authMiddlewares';
import { shipperOrderProtect } from '../middlewares/accessMiddlewares';
import {
    acceptDelivery,
    confirmOTW,
    confirmPickUp,
    getOrders,
    sendOTP,
    verifyOTP,
} from '../controllers/shipperController';

const shipperRouter = express.Router();

shipperRouter.route('/').get(protect, getOrders);

shipperRouter.get('/accept/:orderID', protect, acceptDelivery);

shipperRouter.get(
    '/pickUp/:orderID',
    protect,
    shipperOrderProtect,
    confirmPickUp
);
shipperRouter.get('/otw/:orderID', protect, shipperOrderProtect, confirmOTW);

shipperRouter
    .route('/otp/:orderID')
    .get(protect, shipperOrderProtect, sendOTP)
    .post(protect, shipperOrderProtect, verifyOTP);

export default shipperRouter;
