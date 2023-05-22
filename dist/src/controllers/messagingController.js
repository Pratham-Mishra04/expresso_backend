"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat = exports.newChat = exports.getChat = exports.getChats = exports.deleteMessage = exports.addMessage = void 0;
const catchAsync_1 = require("../managers/catchAsync");
const chatModel_1 = require("../models/chatModel");
const messageModel_1 = require("../models/messageModel");
const userModel_1 = require("../models/userModel");
exports.addMessage = (0, catchAsync_1.default)(async (req, res, next) => {
    const chat = await chatModel_1.default.findById(req.params.id);
    const message = await messageModel_1.default.create({
        body: req.body.message,
        sentBy: req.user.id,
        chat: chat._id,
    });
    chat.latestMessage = message._id;
    await chat.save();
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        message,
    });
});
exports.deleteMessage = (0, catchAsync_1.default)(async (req, res, next) => {
    const message = await messageModel_1.default.findById(req.params.id);
    await message.delete();
    //update latest message
});
exports.getChats = (0, catchAsync_1.default)(async (req, res, next) => {
    const chats = await chatModel_1.default.find({
        users: req.user.id,
    })
        .populate({
        path: 'users',
        select: {
            username: 1,
            name: 1,
            profilePic: 1,
        },
    })
        .populate({
        path: 'latestMessage',
        select: {
            body: 1,
            sentBy: 1,
        },
    })
        .populate({
        path: 'createdBy',
        select: {
            username: 1,
            name: 1,
            profilePic: 1,
        },
        strictPopulate: false,
    });
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        chats,
    });
});
exports.getChat = (0, catchAsync_1.default)(async (req, res, next) => {
    const chat = await chatModel_1.default.findById(req.params.id)
        .populate({
        path: 'users',
        select: {
            username: 1,
            name: 1,
            profilePic: 1,
        },
    })
        .populate({
        path: 'createdBy',
        select: {
            username: 1,
            name: 1,
            profilePic: 1,
        },
        strictPopulate: false,
    });
    const messages = await messageModel_1.default.find({
        chat: chat.id,
    })
        .populate({
        path: 'sentBy',
        select: {
            username: 1,
            name: 1,
            profilePic: 1,
        },
    })
        .sort({ createdAt: -1 });
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestedAt,
        chat: chat,
        messages: messages,
    });
});
exports.newChat = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findById(req.body.userID);
    const existingChat = await chatModel_1.default.findOne({
        $and: [{
                users: req.user.id
            }, {
                users: user.id
            }
        ]
    });
    if (existingChat) {
        res.status(201).json({
            status: 'success',
            requestedAt: req.requestedAt,
            chat: existingChat,
        });
    }
    else {
        const chat = await chatModel_1.default.create({
            users: [req.user.id, user.id],
        });
        res.status(201).json({
            status: 'success',
            requestedAt: req.requestedAt,
            chat,
        });
    }
});
exports.deleteChat = (0, catchAsync_1.default)(async (req, res, next) => {
    const chat = await chatModel_1.default.findById(req.params.id);
    chat.messages.forEach(async (messageID) => {
        await messageModel_1.default.deleteOne(messageID);
    });
    await chat.delete();
    res.status(204).json({
        status: 'success',
        requestedAt: req.requestedAt,
    });
});
//# sourceMappingURL=messagingController.js.map