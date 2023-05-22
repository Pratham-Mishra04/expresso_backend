"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const messagingController_1 = require("../controllers/messagingController");
const messagingRouter = express.Router();
messagingRouter.route('/chats').get(authMiddlewares_1.protect, messagingController_1.getChats).post(authMiddlewares_1.protect, messagingController_1.newChat);
messagingRouter
    .route('/chats/:id')
    .get(authMiddlewares_1.protect, messagingController_1.getChat)
    .delete(authMiddlewares_1.protect, messagingController_1.deleteChat);
messagingRouter
    .route('/:id')
    .post(authMiddlewares_1.protect, messagingController_1.addMessage)
    .delete(authMiddlewares_1.protect, messagingController_1.deleteMessage);
exports.default = messagingRouter;
//# sourceMappingURL=messagingRouter.js.map