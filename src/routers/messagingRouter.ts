import * as express from 'express';
import { protect } from '../middlewares/authMiddlewares';
import {
    addMessage,
    deleteChat,
    deleteMessage,
    getChat,
    getChats,
    newChat,
} from '../controllers/messagingController';

const messagingRouter = express.Router();

messagingRouter.route('/chats').get(protect, getChats).post(protect, newChat);

messagingRouter
    .route('/chats/:id')
    .get(protect, getChat)
    .delete(protect, deleteChat);
    
messagingRouter
    .route('/:id')
    .post(protect, addMessage)
    .delete(protect, deleteMessage);

export default messagingRouter;
