import mongoose, { Schema, Document } from 'mongoose';

export interface ChatDocument extends Document {
    users: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    createdBy:mongoose.Schema.Types.ObjectId;
    messages: mongoose.Schema.Types.ObjectId[];
    latestMessage: mongoose.Schema.Types.ObjectId;
}

const chatSchema: Schema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

chatSchema.index({ createdAt: -1 });

chatSchema.virtual('messages', {
    ref: 'Message',
    foreignField: 'chat',
    localField: '_id',
});

const Chat = mongoose.model<ChatDocument>('Chat', chatSchema);

export default Chat;
