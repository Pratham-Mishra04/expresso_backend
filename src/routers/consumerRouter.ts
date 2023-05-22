import * as express from 'express';
import { protect } from '../middlewares/authMiddlewares';
import {
    createOrder,
    deleteOrder,
    getOrder,
} from '../controllers/consumerController';
import { userOrderProtect } from '../middlewares/accessMiddlewares';
import { joiOrderCreateValidator } from '../validators/joiValidators/joiOrderValidator';

const consumerRouter = express.Router();

consumerRouter.route('/').post(protect, joiOrderCreateValidator, createOrder);

consumerRouter
    .route('/:orderID')
    .get(protect, userOrderProtect, getOrder)
    .delete(protect, userOrderProtect, deleteOrder);

export default consumerRouter;
