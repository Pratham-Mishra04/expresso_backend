import catchAsync from '../managers/catchAsync';
import { NextFunction, Request, Response } from 'express';
import Chat from '../models/chatModel';
import Message from '../models/messageModel';
import User from '../models/userModel';

export const addMessage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const chat = await Chat.findById(req.params.id);

        const message = await Message.create({
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
    }
);

export const deleteMessage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const message = await Message.findById(req.params.id);
        await message.delete();

        //update latest message
    }
);

export const getChats = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const chats = await Chat.find({
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
            message:"Chats Fetched",
        });
    }
);

export const getChat = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const chat = await Chat.findById(req.params.id)
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

        const messages = await Message.find({
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
            message:"Chat Fetched",
            chat: chat,
            messages: messages,
        });
    }
);

export const newChat = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById(req.body.userID);
        const existingChat = await Chat.findOne({
            $and:[{
                users:req.user.id
            },{
                users:user.id
            }
            ]
        });

        if (existingChat) {
            res.status(201).json({
                status: 'success',
                requestedAt: req.requestedAt,
                chat: existingChat,
            });
        } else {
            const chat = await Chat.create({
                users: [req.user.id, user.id],
            });
            res.status(201).json({
                status: 'success',
                requestedAt: req.requestedAt,
                message:"New Chat Created",
                chat,
            });
        }
    }
);

export const deleteChat = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const chat = await Chat.findById(req.params.id);

        chat.messages.forEach(async (messageID) => {
            await Message.deleteOne(messageID);
        });

        await chat.delete();

        res.status(204).json({
            status: 'success',
            requestedAt: req.requestedAt,
            message:"Chat Deleted",
        });
    }
);